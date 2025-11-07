import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogSelectorDialogComponent } from '@components/modals/components/dialogs/catalog-selector-dialog/catalog-selector-dialog.component';
import { EntityTypeSelectorDialogComponent } from '@components/modals/components/dialogs/entity-type-selector-dialog/entity-type-selector-dialog.component';
import {
  CatalogSelectorDialogData,
  CatalogSelectorDialogReturnData,
} from '@components/modals/interfaces/catalog-selector-dialog.interface';
import { EntitySelectorDialogData } from '@components/modals/interfaces/entity-selector-dialog.interface';
import {
  EntityTypeSelectorDialogData,
  EntityTypeSelectorDialogReturnData,
} from '@components/modals/interfaces/entity-type-selector-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { EntityType } from '@core/entities/entities-type';
import { SearchQueries } from '@core/ldap/search';
import { TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MultidirectoryUiKitModule, MultiselectComponent } from 'multidirectory-ui-kit';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';
import { catchError, map, take, throwError } from 'rxjs';

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.scss'],
  imports: [MultidirectoryUiKitModule, TranslocoPipe, FormsModule, CommonModule],
})
export class EntitySelectorComponent {
  @ViewChild('selector', { static: false }) selector?: MultiselectComponent;

  selectedCatalogDn = '';
  name = '';
  availableGroups: MultiselectModel[] = [];
  entityTypes: EntityType[] = ENTITY_TYPES;
  entityTypeDisplay = '';
  allowSelectEntityTypes = true;
  itemSelected = output<MultiselectModel[]>();
  selectedData: MultiselectModel[] = [];

  readonly settings = input.required<EntitySelectorDialogData>();

  private readonly dialogService = inject(DialogService);
  private readonly api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const settings = this.settings();
    if (settings.selectedEntityTypes && settings.selectedEntityTypes.length > 0) {
      this.entityTypes = settings.selectedEntityTypes;
    }

    this.allowSelectEntityTypes = settings.allowSelectEntityTypes;
    this.entityTypeDisplay = this.entityTypes.map((x) => x.name).join(' ИЛИ ');
    this.selectedCatalogDn = settings.selectedPlaceDn;

    this.selectedData = settings.selectedEntities;
    this.cdr.markForCheck();
  }

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
        },
      })
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (!result?.length) {
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
            this.settings().entityToMove.every((e) => !entity.object_name?.includes(e.id)),
          ),
        })),
        catchError((err) => throwError(() => err)),
      )
      .subscribe((res) => {
        this.availableGroups = res.search_result.map((x) => {
          return new MultiselectModel({
            id: x.object_name,
            selected: false,
            title: x.object_name,
            badge_title: x.object_name,
          });
        });
        this.addRootCatalog();
        this.selector?.showMenu();
        this.cdr.detectChanges();
      });
  }

  onItemSelected(event: MultiselectModel[]) {
    this.selectedData = event;
    this.itemSelected.emit(event);
  }

  private addRootCatalog() {
    this.availableGroups.push(new MultiselectModel({
      id: this.selectedCatalogDn,
      selected: false,
      title: this.selectedCatalogDn,
      badge_title: this.selectedCatalogDn
    }));
  }
}
