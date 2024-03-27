import { ChangeDetectorRef, Component, Inject, Input, OnDestroy } from "@angular/core";
import { ModalInjectDirective, ModalService } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { Subject } from "rxjs";

@Component({
    selector: 'app-user-properties',
    styleUrls: ['./user-properties.component.scss'],
    templateUrl: 'user-properties.component.html'
})
export class UserPropertiesComponent implements  OnDestroy {
    unsubscribe = new Subject<boolean>();
    @Input() accessor!: LdapAttributes;
    properties?: any[];
    propColumns = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Значение', prop: 'val', flexGrow: 1 },
    ];    
    
    constructor(
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
        private cdr: ChangeDetectorRef) {}
    
    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    onTabChanged() {
        this.modalControl.modal?.resize();
        this.cdr.detectChanges();
    }
}