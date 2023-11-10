import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output, ViewChild, forwardRef } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { ModalInjectDirective, ModalService } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { PropertyTypeResolver } from "projects/multidirectory-app/src/app/core/ldap/property-type-resolver";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { DatagridComponent } from "projects/multidirectory-ui-kit/src/public-api";
import { Subject, take, tap } from "rxjs";

@Component({
    selector: 'app-entity-attributes',
    templateUrl: './entity-attributes.component.html',
    styleUrls: ['./entity-attributes.component.scss']
})
export class EntityAttributesComponent implements AfterViewInit {
    @ViewChild('propGrid', { static: true }) propGrid: DatagridComponent | null = null;
    @ViewChild('propertyEditor', { static: true }) attributeEditor!: ModalInjectDirective;
    unsubscribe = new Subject<boolean>();

    properties: any[] = [];
    propColumns = [
        { name:  translate('entity-attributes.name'), prop: 'name', maxWidth: 150 },
        { name:  translate('entity-attributes.value'), prop: 'val', flexGrow: 1 },
    ];    

    constructor(
        private api: MultidirectoryApiService,
        private navigation: LdapNavigationService,
        private cdr: ChangeDetectorRef,
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
        private toastr: ToastrService) {}

    ngAfterViewInit(): void {
        this.loadData().subscribe(() => {
            if(this.propGrid) {
                this.propGrid.grid.recalculate();
            }
            this.cdr.detectChanges();
            this.modalControl?.modal?.resize();
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

    onEditClick() {
        return this.api.search(
            SearchQueries.getSchema()
        ).subscribe(x => {
            if(!this.propGrid || !this.propGrid.selected?.[0]) {
                this.toastr.error('Выберите аттрибут для редактирования');
                return;
            }
            const types = x.search_result?.[0]?.partial_attributes.find(x => x.type == "attributeTypes")?.vals
            if(!types) {
                this.toastr.error('Не удалось получить схему');
                return;           
            }
            const attribute = this.propGrid.selected[0];
            const attributeDescription = types.find(y => y.includes("NAME '" + attribute.name));
            if(!attributeDescription) {
                this.toastr.error('Не удалось получить схему');
                return;           
            }
            const extractSyntax = /SYNTAX \'([\d+.]+)\'/gi;
            const syntax = extractSyntax.exec(attributeDescription);
            if(!syntax || syntax.length < 2) {
                this.toastr.error('Не удалось получить схему');
                return;           
            }
            const propertyType = PropertyTypeResolver.getPropertyType(syntax[1]);
            this.navigation.entityAccessorRx().pipe(take(1)).subscribe(accessor => {
                if(!accessor) {
                    return;
                }
                const indx = this.properties.findIndex(x => x.name == attribute.name);
                if(indx == -1) {
                    return;
                }
                this.attributeEditor.open({}, { propertyType: propertyType, propertyName: attribute.name, propertyValue: attribute.val }).pipe(take(1)).subscribe(x => {
                    if(!x) {
                        return;
                    }
                    accessor[attribute.name] = x;
                    this.properties[indx].val = accessor[attribute.name];
                    this.cdr.detectChanges();
                })
            })
        });
    }
}