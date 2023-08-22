import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { DatagridComponent } from "multidirectory-ui-kit";
import { tap } from "rxjs";
import { SearchQueries } from "../../../core/ldap/search";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";

@Component({
    selector: 'app-entity-attributes',
    styleUrls: ['./entity-attributes.component.scss'],
    templateUrl: 'entity-attributes.component.html'
})
export class EntityAttributesComponent implements OnInit {
    @ViewChild('propGrid', { static: true }) propGrid!: DatagridComponent;
    
    private _entityId: string = ''; 
    @Input() set entityDn(id: string | undefined) {
        this._entityId = id ?? '';
    }
    get entityDn(): string {
        return this._entityId;
    }

    properties?: any[];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    

    constructor(private api: MultidirectoryApiService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        if(!this.entityDn) {
            return;
        }
    }

    loadData() {
        return this.api.search(
            SearchQueries.getProperites(this.entityDn)
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