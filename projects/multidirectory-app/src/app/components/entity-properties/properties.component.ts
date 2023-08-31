import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subject, take } from "rxjs";
import { LdapEntityType } from "../../core/ldap/ldap-entity-type";
import { LdapNavigationService } from "../../services/ldap-navigation.service";
import { LdapEntity } from "../../core/ldap/ldap-entity";
import { MdModalComponent } from "multidirectory-ui-kit";

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
        private cdr: ChangeDetectorRef) {
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
}