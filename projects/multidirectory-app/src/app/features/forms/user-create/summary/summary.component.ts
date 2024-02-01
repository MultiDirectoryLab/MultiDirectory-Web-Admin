import { Component, Input } from "@angular/core";
import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { UserCreateRequest } from "projects/multidirectory-app/src/app/models/user-create/user-create.request";
import { UserCreateService } from "projects/multidirectory-app/src/app/services/user-create.service";

@Component({
    selector: 'app-user-create-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class UserCreateSummaryComponent {
    @Input() selectedNode: LdapEntity | null = null;
    @Input() setupRequest!: UserCreateRequest;

    constructor(public setup: UserCreateService) {}

}