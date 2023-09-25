import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MdModalComponent, MultiselectComponent } from "multidirectory-ui-kit";
import { EntityTypeSelectorComponent } from "../entity-type-selector/entity-type-selector.component";
import { Subject, catchError, take, throwError } from "rxjs";
import { EntityType } from "../../../core/entities/entities-type";
import { CatalogSelectorComponent } from "../catalog-selector/catalog-selector.component";
import { ENTITY_TYPES } from "../../../core/entities/entities-available-types";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { SearchQueries } from "../../../core/ldap/search";
import { MultiselectModel } from "projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model";

@Component({
    selector: 'app-group-selector',
    templateUrl: './group-selector.component.html',
    styleUrls: ['./group-selector.component.scss']
}) 
export class GroupSelectorComponent implements AfterViewInit {
    @ViewChild('modal', { static: true }) modal?: MdModalComponent;
    @ViewChild('entityTypeSelector', { static: true }) entityTypeSelector?: EntityTypeSelectorComponent;
    @ViewChild('catalogSelector', { static: true }) catalogSelector?: CatalogSelectorComponent;
    @ViewChild('selector', { static: true }) selector?: MultiselectComponent; 
    entityTypes: EntityType[] = [];
    entityTypeDisplay = '';
    selectedCatalogDn = '';
    name = '';
    availableGroups: MultiselectModel[] = [];
    result = new Subject<MultiselectModel[] | null>();
    constructor(private api: MultidirectoryApiService, private cdr: ChangeDetectorRef) {}
    ngAfterViewInit(): void {
        this.entityTypes = ENTITY_TYPES;
        this.entityTypeDisplay = ENTITY_TYPES.map(x => x.name).join(' ИЛИ ');
        this.selectedCatalogDn = 'ou=users,dc=dev,dc=ru';
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
        this.entityTypeSelector?.open().pipe(
            take(1)
        ).subscribe(result => {
            if(!result) {
                this.entityTypeDisplay = '';
                this.entityTypes = [];
                return;
            }
            this.entityTypeDisplay = result.map(x => x.name).join(' ИЛИ ');
            this.entityTypes = result;
        });
    }

    selectCatalog() {
        this.catalogSelector?.open().pipe(
            take(1)
        ).subscribe(result => {
            if(!result) {
                this.selectedCatalogDn = '';
                return;
            }
            this.selectedCatalogDn = result.id;
        });
    }

    checkNames() {
        if(!this.selectedCatalogDn || !this.entityTypes) {
            return;
        }
        this.api.search(SearchQueries.findGroup(this.name, this.selectedCatalogDn, [])).pipe(
            catchError(err => {
                return throwError(() => err);
            })
        ).subscribe(res => {
            this.availableGroups = res.search_result.map((x, ind) => new MultiselectModel({
                id: x.object_name,
                key: 'group',
                selected: false,
                title: x.object_name
            }));
            this.cdr.detectChanges();
            //this.spinner.hide();
        })
    }

    finish() {
        this.result.next(this.selector?.selectedData ?? null);
        this.modal?.close();
    }
}