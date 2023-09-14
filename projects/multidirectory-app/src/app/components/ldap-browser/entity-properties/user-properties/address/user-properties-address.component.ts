import { Component, Input } from "@angular/core";
import { DropdownOption } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";

@Component({
    selector: 'app-user-properties-address',
    templateUrl: './user-properties-address.component.html',
    styleUrls: ['./user-properties-address.component.scss']
})
export class UserPropertiesAddressComponent {
    @Input() accessor: LdapAttributes | null = null;

    constructor() {}
    countries = [
        new DropdownOption({ title: 'Russia', value: 'Russia' }),
        new DropdownOption({ title: 'Kazakhstan', value: 'Kazakhstan' })
    ];
}