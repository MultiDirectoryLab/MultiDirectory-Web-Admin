import { Component, ViewChild } from "@angular/core";
import { MdModalComponent } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, switchMap, take } from "rxjs";
import { LdapEntity } from "../../core/ldap/ldap-entity";
import { LdapEntityType } from "../../core/ldap/ldap-entity-type";
import { AttributeService } from "../../services/attributes.service";
import { LdapNavigationService } from "../../services/ldap-navigation.service";

@Component({
    selector: 'app-properties',
    styleUrls: ['./properties.component.scss'],
    templateUrl: './properties.component.html',
})
export class EntityPropertiesComponent {
    EntityTypes = LdapEntityType;
    @ViewChild('properties', { static: true }) propertiesModal!: MdModalComponent;
    _selectedEntity: LdapEntity | null= null;
    _entityType: LdapEntityType | null = null;

    unsubscribe = new Subject<boolean>();

    constructor(
        public navigation: LdapNavigationService, 
        public toastr: ToastrService, 
        private attributes: AttributeService) {
    }
    open() {
        this._selectedEntity = this.navigation.selectedEntity?.[0] ?? null;
        this._entityType = this._selectedEntity?.type ?? null;
        if(!this._selectedEntity || !this._entityType) {
            this.toastr.error('Для просмотра свойств необходимо выбрать сущность')
            return;
        }
        this.propertiesModal.open()
    }
    close() {
        this.propertiesModal.close()
    }
    save() {
        this.navigation.getEntityAccessor().pipe(
            take(1),
            switchMap(accessor => {
                if(!accessor) {
                    return EMPTY;
                }
                console.log(accessor);
                return this.attributes.saveEntity(accessor);
            })
        ).subscribe((accessor) => {
            console.log(accessor);
        });
    }
}