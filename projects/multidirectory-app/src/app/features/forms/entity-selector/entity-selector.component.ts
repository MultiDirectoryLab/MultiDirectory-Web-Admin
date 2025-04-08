import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { EntityType } from '@core/entities/entities-type';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  ModalInjectDirective,
  MultiselectComponent,
  PlaneButtonComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';
import { catchError, map, Subject, take, throwError } from 'rxjs';
import { EntitySelectorSettings } from './entity-selector-settings.component';

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.scss'],
  imports: [
    TranslocoPipe,
    TextboxComponent,
    FormsModule,
    ButtonComponent,
    PlaneButtonComponent,
    MultiselectComponent,
  ],
})
export class EntitySelectorComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  private cdr = inject(ChangeDetectorRef);
  private ldapLoader = inject(LdapEntryLoader);
  private windows = inject(AppWindowsService);
  private modalControl = inject(ModalInjectDirective);

  @ViewChild('selector', { static: true }) selector?: MultiselectComponent;
  selectedCatalogDn = '';
  name = '';
  availableGroups: MultiselectModel[] = [];
  result = new Subject<MultiselectModel[]>();

  settings: EntitySelectorSettings = new EntitySelectorSettings();
  entityTypes: EntityType[] = ENTITY_TYPES;
  entityTypeDisplay = '';
  allowSelectEntityTypes = true;

  ngOnInit(): void {
    if (this.modalControl.contentOptions.settings) {
      this.settings = this.modalControl.contentOptions.settings;
      if (this.settings.selectedEntityTypes && this.settings.selectedEntityTypes.length > 0) {
        this.entityTypes = this.settings.selectedEntityTypes;
      }

      this.allowSelectEntityTypes = this.settings.allowSelectEntityTypes;
    }

    this.entityTypeDisplay = this.entityTypes.map((x) => x.name).join(' ИЛИ ');
    this.ldapLoader
      .get()
      .pipe(take(1))
      .subscribe((x) => {
        this.selectedCatalogDn = x[0].id ?? '';
      });
  }

  close() {
    this.modalControl?.close([]);
  }

  selectEntityType() {
    this.windows
      .openEntityTypeSelector(this.entityTypes)
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          return;
        }
        this.entityTypeDisplay = result.map((x) => x.name).join(' ИЛИ ');
        this.entityTypes = result;
      });
  }

  selectCatalog() {
    this.windows
      .openCatalogSelector([])
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          this.selectedCatalogDn = '';
          return;
        }
        this.selectedCatalogDn = result[0].id;
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
              (e) => !entity.object_name.includes(<string>e.entry?.object_name),
            ),
          ),
        })),
        catchError((err) => {
          return throwError(() => err);
        }),
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

  finish() {
    this.modalControl?.close(this.selector?.selectedData ?? []);
  }
}
