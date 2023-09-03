import { AfterViewInit, Component, Input } from "@angular/core";
import { DropdownOption } from "multidirectory-ui-kit";
import { LdapEntityAccessor } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-accessor";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { take } from "rxjs";

@Component({
    selector: 'app-user-properties-address',
    templateUrl: './user-properties-address.component.html',
    styleUrls: ['./user-properties-address.component.scss']
})
export class UserPropertiesAddressComponent {
    @Input() accessor: LdapEntityAccessor | null = null;

    constructor() {}
    countries = [
        new DropdownOption({ title: 'Russia', value: 'Russia' }),
        new DropdownOption({ title: 'Kazakhstan', value: 'Kazakhstan' })
    ];
}