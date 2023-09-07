import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { AttributeListComponent } from "../../attributes-list/attributes-list.component";
import { take, takeUntil } from "rxjs";
import { ChangeDescription } from "projects/multidirectory-app/src/app/core/ldap/ldap-change";
import { LdapOperation } from "projects/multidirectory-app/src/app/models/entry/update-request";

@Component({
    selector: 'app-user-properties-general',
    styleUrls: [ './user-properties-general.component.scss'],
    templateUrl: './user-properties-general.component.html'
})
export class UserPropertiesGeneralComponent {
    @Input() accessor: LdapAttributes | null = null;
    @ViewChild('attributeList', { static: true }) attributeList: AttributeListComponent | null = null;

    constructor(public toastr: ToastrService) {}
 
    showOtherSelect() {
        this.toastr.info('IN PROGRESS');
    }

    changeOtherAttributeList(title: string, field: string) {
        if(!this.accessor) {
            return;
        }
        if(!this.accessor[field]) {
            this.accessor[field] = [];
        }
        const closeRx = this.attributeList!.open(title, field, this.accessor[field]);
        closeRx.pipe(take(1)).subscribe(result => {
            if(!result) {
                return;
            }
            this.accessor![field] = result;
        });
    }
}