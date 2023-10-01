import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MdModalComponent, ModalInjectDirective } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, of, switchMap, take, tap } from "rxjs";
import { LdapEntity } from "../../../core/ldap/ldap-entity";
import { LdapAttributes } from "../../../core/ldap/ldap-entity-proxy";
import { LdapEntityType } from "../../../core/ldap/ldap-entity-type";
import { AttributeService } from "../../../services/attributes.service";
import { LdapNavigationService } from "../../../services/ldap-navigation.service";

@Component({
    selector: 'app-properties',
    styleUrls: ['./properties.component.scss'],
    templateUrl: './properties.component.html',
})
export class EntityPropertiesComponent implements OnInit {
    EntityTypes = LdapEntityType;
    _selectedEntity: LdapEntity | null= null;
    _entityType: LdapEntityType | null = null;
    accessor: LdapAttributes | null = null;
    unsubscribe = new Subject<boolean>();

    constructor(
        public navigation: LdapNavigationService, 
        public toastr: ToastrService, 
        private cdr: ChangeDetectorRef,
        private modalControl: ModalInjectDirective,
        private attributes: AttributeService) {
    }
    ngOnInit(): void {
        this._selectedEntity = this.navigation.selectedEntity?.[0] ?? null;
        this._entityType = this._selectedEntity?.type ?? null;
        if(!this._selectedEntity || !this._entityType) {
            this.toastr.error('Для просмотра свойств необходимо выбрать сущность')
            return;
        }
        this.navigation.getEntityAccessor().pipe(
            take(1), 
            tap(accessor => { this.accessor = accessor; }),
        ).subscribe(() => {
            this.cdr.detectChanges();
            this.modalControl.modal?.resize();
        });
    }
    
    close() {
        this.modalControl.close()
    }
    save() {
        this.modalControl.modal?.showSpinner();
        this.navigation.getEntityAccessor().pipe(
            take(1),
            switchMap(accessor => {
                if(!accessor) {
                    return EMPTY;
                }
                return this.attributes.saveEntity(accessor);
            })
        ).subscribe({
            complete: () => {
                this.modalControl.modal?.hideSpinner();
                this.modalControl.close();
            },
            error: (err) => {
                this.toastr.error(err);
                this.modalControl?.modal?.hideSpinner();
            }
        });
    }
}