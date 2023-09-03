import { Component, Input } from "@angular/core";
import { LdapEntityAccessor } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-accessor";

@Component({
    selector: 'app-user-properties-profile',
    styleUrls: ['./user-properties-profile.component.scss'],
    templateUrl: './user-properties-profile.component.html'
})
export class UserPropertiesProfileComponent {
    @Input() accessor: LdapEntityAccessor | null = null;
}