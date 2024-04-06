import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { MdModalComponent, ModalInjectDirective } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subject, of, switchMap, take, tap } from "rxjs";
import { translate } from "@ngneat/transloco";
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { LdapEntryType } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-type";
import { AttributeService } from "projects/multidirectory-app/src/app/services/attributes.service";

@Component({
    selector: 'app-properties',
    styleUrls: ['./properties.component.scss'],
    templateUrl: './properties.component.html',
    providers: [
        { provide: AttributeService, useClass: AttributeService }
    ]
})
export class EntityPropertiesComponent implements OnInit {
    EntityTypes = LdapEntryType;
    @Input() selectedEntity: LdapEntryNode | null= null;
    _entityType: LdapEntryType | null = null;
    accessor!: LdapAttributes;
    unsubscribe = new Subject<boolean>();

    constructor(
        public toastr: ToastrService, 
        private cdr: ChangeDetectorRef,
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
        private attributes: AttributeService) {
    }
    ngOnInit(): void {
        if(!this.modalControl.contentOptions?.selectedEntity) {
            return;
        }
        this.selectedEntity = this.modalControl.contentOptions.selectedEntity;
        this._entityType = this.selectedEntity?.type ?? null;
        if(!this.selectedEntity || !this._entityType) {
            this.toastr.error(translate('properties-modal.select-entity'))
            return;
        }
        this.attributes.setEntityAccessor(this.selectedEntity).pipe(
            take(1), 
            tap(accessor => { 
                if(!accessor) {
                    throw 'Accessor could not be reteived!';
                }
                this.accessor = accessor 
            }),
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
        this.attributes.entityAccessorRx().pipe(
            take(1),
            switchMap(accessor => {
                if(!accessor) {
                    return EMPTY;
                }
                return this.attributes.saveEntity(accessor);
            }),
            switchMap(() => {
                return this.attributes.setEntityAccessor(undefined);
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