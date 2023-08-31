import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild, forwardRef } from "@angular/core";
import { ModalService } from "multidirectory-ui-kit";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { DatagridComponent } from "projects/multidirectory-ui-kit/src/public-api";
import { Subject, tap } from "rxjs";
import { EntityPropertiesComponent } from "../properties.component";
import { ModalComponent } from "ng-modal-full-resizable";

@Component({
    selector: 'app-entity-attributes',
    templateUrl: './entity-attributes.component.html'
})
export class EntityAttributesComponent implements AfterViewInit {
    @ViewChild('propGrid', { static: true }) propGrid: DatagridComponent | null = null;
    unsubscribe = new Subject<boolean>();
     
    properties: any[] = [];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    

    constructor(
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef,
        private modal: ModalService) {}

    ngAfterViewInit(): void {
        this.loadData().subscribe(() => {
            if(this.propGrid) {
                this.propGrid.grid.recalculate();
            }
            this.cdr.detectChanges();
            this.modal.resize();
            this.cdr.detectChanges();
        });
    }

        
    loadData() {
        return this.api.search(
            SearchQueries.getProperites(this.navigation.selectedEntity?.[0]?.id ?? '')
        ).pipe(
            tap(resp => {
                this.properties = [{name: 'DN', val: resp.search_result[0].object_name}].concat(resp.search_result[0].partial_attributes.map( x => {
                    return {
                        name: x.type,
                        val: x.vals.join(';')
                    }
                }));
            })
        );
    }

    onResize() {
        alert('resize');
    }
}