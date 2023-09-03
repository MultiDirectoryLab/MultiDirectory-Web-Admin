import { Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LdapEntityAccessor } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-accessor";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { take } from "rxjs";

@Component({
    selector: 'app-user-properties-general',
    styleUrls: [ './user-properties-general.component.scss'],
    templateUrl: './user-properties-general.component.html'
})
export class UserPropertiesGeneralComponent {
    @Input() accessor: LdapEntityAccessor | null = null;
    constructor(public toastr: ToastrService) {}
 
    showOtherSelect() {
        this.toastr.info('IN PROGRESS');
    }
}