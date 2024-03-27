import { ChangeDetectorRef, Component, Inject, Input } from "@angular/core";
import { ModalInjectDirective } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { Subject } from "rxjs";

@Component({
    selector: 'app-group-properties',
    templateUrl: './group-properties.component.html',
    styleUrls: ['./group-properties.component.scss']
})
export class GroupPropertiesComponent {
    unsubscribe = new Subject<boolean>();
    @Input() accessor!: LdapAttributes;
    constructor(
        @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
        private cdr: ChangeDetectorRef) {}
    
    onTabChanged() {
        this.modalControl.modal?.resize();
        this.cdr.detectChanges();
    }
}