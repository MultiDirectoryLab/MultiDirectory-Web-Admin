import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MultidirectoryUiKitModule, MultiselectComponent } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
} from '../../../interfaces/entity-selector-dialog.interface';
import { EntityType } from '@core/entities/entities-type';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { MultiselectModel } from '@features/access-policy/access-policy-view/multiselect-model';
import { catchError, map, Subject, take, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchQueries } from '@core/ldap/search';
import { EntityTypeSelectorDialogComponent } from '../entity-type-selector-dialog/entity-type-selector-dialog.component';
import {
  EntityTypeSelectorDialogData,
  EntityTypeSelectorDialogReturnData,
} from '../../../interfaces/entity-type-selector-dialog.interface';
import {
  CatalogSelectorDialogData,
  CatalogSelectorDialogReturnData,
} from '../../../interfaces/catalog-selector-dialog.interface';
import { CatalogSelectorDialogComponent } from '../catalog-selector-dialog/catalog-selector-dialog.component';

@Component({
  selector: 'app-entity-selector-dialog',
  standalone: true,
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoPipe, FormsModule],
  templateUrl: './entity-selector-dialog.component.html',
  styleUrl: './entity-selector-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitySelectorDialogComponent implements OnInit {
  /** DIRECTIVES **/
  @ViewChild('selector', { static: false }) selector?: MultiselectComponent;

  public selectedCatalogDn = '';
  public name = '';
  public availableGroups: MultiselectModel[] = [];
  public result = new Subject<MultiselectModel[]>();
  public entityTypes: EntityType[] = ENTITY_TYPES;
  public entityTypeDisplay = '';
  public allowSelectEntityTypes = true;

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<EntitySelectorDialogReturnData, EntitySelectorDialogComponent> =
    inject(DialogRef);
  private dialogData: EntitySelectorDialogData = inject(DIALOG_DATA);
  public settings = this.dialogData;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private ldapLoader: LdapEntryLoader = inject(LdapEntryLoader);

  public ngOnInit(): void {
    if (this.settings.selectedEntityTypes && this.settings.selectedEntityTypes.length > 0) {
      this.entityTypes = this.settings.selectedEntityTypes;
    }

    this.allowSelectEntityTypes = this.settings.allowSelectEntityTypes;
    this.entityTypeDisplay = this.entityTypes.map((x) => x.name).join(' ИЛИ ');

    this.ldapLoader
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((x) => {
        this.selectedCatalogDn = x[0].id ?? '';
        this.cdr.detectChanges();
      });
  }

  /** METHODS**/
  selectEntityType() {
    this.dialogService
      .open<
        EntityTypeSelectorDialogReturnData,
        EntityTypeSelectorDialogData,
        EntityTypeSelectorDialogComponent
      >({
        component: EntityTypeSelectorDialogComponent,
        dialogConfig: {
          width: '580px',
          minHeight: '360px',
          data: { selectedEntityTypes: this.entityTypes },
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.entityTypeDisplay = result.map((x) => x.name).join(' ИЛИ ');
        this.entityTypes = result;
      });
  }

  selectCatalog() {
    this.dialogService
      .open<
        CatalogSelectorDialogReturnData,
        CatalogSelectorDialogData,
        CatalogSelectorDialogComponent
      >({
        component: CatalogSelectorDialogComponent,
        dialogConfig: {
          minHeight: '360px',
          data: [],
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!result?.length) {
          this.selectedCatalogDn = '';
          return;
        }
        this.selectedCatalogDn = result[0].id;
        this.cdr.detectChanges();
      });
  }

  checkNames() {
    if (!this.selectedCatalogDn || !this.entityTypes) {
      return;
    }

    const entityClasses = this.entityTypes.flatMap((x) => x.entity.split(','));

    this.api
      .search(SearchQueries.findEntities(this.name, this.selectedCatalogDn, entityClasses))
      .pipe(
        map((res) => ({
          ...res,
          search_result: res.search_result.filter((entity) =>
            this.settings.entityToMove.every(
              (e) => !entity.object_name.includes(e.entry?.object_name as string),
            ),
          ),
        })),
        catchError((err) => throwError(() => err)),
      )
      .subscribe((res) => {
        this.availableGroups = res.search_result.map((x) => {
          return new MultiselectModel({
            id: x.object_name,
            key: 'group',
            selected: false,
            title: x.object_name,
            badge_title: x.object_name,
          });
        });
        this.selector?.showMenu();
        this.cdr.detectChanges();
      });
  }

  public close(params: EntitySelectorDialogReturnData = []): void {
    this.dialogService.close(this.dialogRef);
  }

  public finish(): void {
    console.log('this.selector', this.selector);
    console.log('this.selector?.selectedData', this.selector?.selectedData);
    this.dialogService.close(this.dialogRef, this.selector?.selectedData);
  }
}
