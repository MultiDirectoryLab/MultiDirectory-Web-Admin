import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MdModalComponent, MultiselectComponent } from "multidirectory-ui-kit";
import { EntityTypeSelectorComponent } from "../entity-type-selector/entity-type-selector.component";
import { Subject, catchError, take, throwError } from "rxjs";
import { EntityType } from "../../../core/entities/entities-type";
import { CatalogSelectorComponent } from "../catalog-selector/catalog-selector.component";
import { ENTITY_TYPES } from "../../../core/entities/entities-available-types";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { SearchQueries } from "../../../core/ldap/search";
import { MultiselectModel } from "projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";
import { Constants } from "../../../core/constants";

@Component({
    selector: 'app-group-selector',
    templateUrl: './group-selector.component.html',
    styleUrls: ['./group-selector.component.scss']
}) 
export class GroupSelectorComponent implements OnInit {
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
    constructor(private api: MultidirectoryApiService, private cdr: ChangeDetectorRef, private navigation: LdapNavigationService) {}
    ngOnInit(): void {
        this.entityTypes = ENTITY_TYPES;
        this.entityTypeDisplay = ENTITY_TYPES.map(x => x.name).join(' ИЛИ ');
        const root = this.navigation.getRootDse();
        this.selectedCatalogDn = root[0].node?.id ?? '';
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
            this.availableGroups = res.search_result.map((x, ind) => {
                const name = new RegExp(Constants.RegexGetNameFromDn).exec(x.object_name);
                return new MultiselectModel({
                    id: x.object_name,
                    key: 'group',
                    selected: false,
                    title: name?.[0] ?? x.object_name,
                    badge_title: name?.[1] ?? x.object_name
                })
            });
            this.selector?.showMenu()
            this.cdr.detectChanges();
        })
    }

    finish() {
        this.result.next(this.selector?.selectedData ?? null);
        this.modal?.close();
    }
}