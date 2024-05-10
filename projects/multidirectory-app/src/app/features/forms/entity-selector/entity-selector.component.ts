import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MdModalComponent, MultiselectComponent } from 'multidirectory-ui-kit';
import { Subject, catchError, take, throwError } from 'rxjs';
import { EntityType } from '@core/entities/entities-type';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';
import { Constants } from '@core/constants';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { CatalogSelectorComponent } from '../catalog-selector/catalog-selector.component';
import { AppWindowsService } from '@services/app-windows.service';

@Component({
  selector: 'app-entity-selector',
  templateUrl: './entity-selector.component.html',
  styleUrls: ['./entity-selector.component.scss'],
})
export class EntitySelectorComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal?: MdModalComponent;
  @ViewChild('selector', { static: true }) selector?: MultiselectComponent;
  entityTypes: EntityType[] = [];
  entityTypeDisplay = '';
  selectedCatalogDn = '';
  name = '';
  availableGroups: MultiselectModel[] = [];
  result = new Subject<MultiselectModel[] | null>();
  constructor(
    private api: MultidirectoryApiService,
    private cdr: ChangeDetectorRef,
    private ldapLoader: LdapEntryLoader,
    private windows: AppWindowsService,
  ) {}
  ngOnInit(): void {
    this.entityTypes = ENTITY_TYPES;
    this.entityTypeDisplay = ENTITY_TYPES.map((x) => x.name).join(' ИЛИ ');
    this.ldapLoader
      .get()
      .pipe(take(1))
      .subscribe((x) => {
        const root = x;
        this.selectedCatalogDn = root[0].id ?? '';
      });
  }

  open(): Subject<MultiselectModel[] | null> {
    this.modal?.open();
    return this.result;
  }
  close() {
    this.result?.next(null);
    this.modal?.close();
  }

  selectEntityType() {
    this.windows
      .openEntityTypeSelector()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) {
          this.entityTypeDisplay = '';
          this.entityTypes = [];
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
    this.api
      .search(SearchQueries.findGroup(this.name, this.selectedCatalogDn, []))
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.availableGroups = res.search_result.map((x, ind) => {
          const name = new RegExp(Constants.RegexGetNameFromDn).exec(x.object_name);
          return new MultiselectModel({
            id: x.object_name,
            key: 'group',
            selected: false,
            title: name?.[0] ?? x.object_name,
            badge_title: name?.[1] ?? x.object_name,
          });
        });
        this.selector?.showMenu();
        this.cdr.detectChanges();
      });
  }

  finish() {
    this.result.next(this.selector?.selectedData ?? null);
    this.modal?.close();
  }
}
