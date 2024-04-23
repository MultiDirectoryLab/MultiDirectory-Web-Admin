import { Component, Input } from "@angular/core";
import { LdapAttributes } from "@core/ldap/ldap-entity-proxy";

@Component({
    selector: 'app-user-properties-profile',
    styleUrls: ['./user-properties-profile.component.scss'],
    templateUrl: './user-properties-profile.component.html'
})
export class UserPropertiesProfileComponent {
    @Input() accessor: LdapAttributes | null = null;
    homeDirectorySelection: number = 1
}