import { Component, Input, ViewChild } from "@angular/core";
import BitSet from "bitset";
import { ModalInjectDirective } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { take } from "rxjs";

@Component({
    selector: 'app-user-properties-account',
    templateUrl: './user-properties-account.component.html',
    styleUrls: ['./user-properties-account.component.scss']
})
export class UserPropertiesAccountComponent {
    @Input() accessor: LdapAttributes | null = null;

    @ViewChild('editLogonTime') editLogonTime!: ModalInjectDirective;
    showLogonTimeEditor() {
        this.editLogonTime.open({ 'width': '732px' }, { 'logonHours': this.accessor!.logonHours }).pipe(
            take(1)
        ).subscribe((result: string | null) => {
            if(!this.accessor || !result) 
                return;

            this.accessor.logonHours = [result];
        });
    }
}