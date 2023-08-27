import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DatagridComponent } from "multidirectory-ui-kit";
import { Subject, takeUntil, tap } from "rxjs";
import { SearchQueries } from "../../../core/ldap/search";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";

@Component({
    selector: 'app-entity-attributes',
    styleUrls: ['./entity-attributes.component.scss'],
    templateUrl: 'entity-attributes.component.html'
})
export class EntityAttributesComponent implements OnInit, OnDestroy {
    unsubscribe = new Subject<boolean>();
    @ViewChild('propGrid', { static: true }) propGrid!: DatagridComponent;

    properties?: any[];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    

    constructor(
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }


    loadData() {
        return this.api.search(
            SearchQueries.getProperites(this.navigation.selectedEntity?.id ?? '')
        ).pipe(
            tap(resp => {
            this.properties = [{name: 'DN', val: resp.search_result[0].object_name}].concat(resp.search_result[0].partial_attributes.map( x => {
                return {
                    name: x.type,
                    val: x.vals.join(';')
                }
            }));
            this.propGrid.grid.recalculate();
            this.cdr.detectChanges();
        }));
    }
}