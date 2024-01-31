import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { take } from "rxjs";
import { DatagridComponent } from "multidirectory-ui-kit";
import { Group } from "projects/multidirectory-app/src/app/core/groups/group";
import { Constants } from "projects/multidirectory-app/src/app/core/constants";
import { translate } from "@ngneat/transloco";
import { LdapWindowsService } from "projects/multidirectory-app/src/app/services/ldap-windows.service";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { AttributeService } from "projects/multidirectory-app/src/app/services/attributes.service";
import { GroupSelectorComponent } from "projects/multidirectory-app/src/app/components/forms/group-selector/group-selector.component";

@Component({
    selector: 'app-member-of',
    templateUrl: './member-of.component.html',
    styleUrls: ['./member-of.component.scss']
})
export class MemberOfComponent implements AfterViewInit {
    private _accessor: LdapAttributes | null = null;
    groups: Group[] = [];
    @ViewChild('groupSelector') groupSelector?: GroupSelectorComponent;
    @ViewChild('groupList') groupList?: DatagridComponent;

    @Input() set accessor(accessor: LdapAttributes | null) {
        if(!accessor) {
            this._accessor = null;
            return;
        }
        this._accessor = accessor; 
        this.groups = this._accessor.memberOf?.map(x => this.createGroupFromDn(x)) ?? [];
    }
    
    get accessor(): LdapAttributes | null{
        return this._accessor;
    }

    columns = [
        { name: translate('member-of.name'),  prop: 'name',  flexGrow: 1 },
        { name: translate('member-of.catalog-path'),  prop: 'path',  flexGrow: 3 },
    ];

    constructor(private windows: LdapWindowsService, private navigation: LdapNavigationService, private attributes: AttributeService) {}

    ngAfterViewInit(): void {
         
    }

    private createGroupFromDn(dn: string) {
        const name = new RegExp(Constants.RegexGetNameFromDn).exec(dn);
        const path = new RegExp(Constants.RegexGetPathFormDn).exec(dn);
        return new Group({
            name:  name?.[1] ?? '', 
            path: path?.[1] ?? '',
            dn: dn
        });
    }

    addGroup() {
        this.groupSelector?.open()
            .pipe(take(1))
            .subscribe(res => {
                if(res && !!this.accessor) {
                    res = res.filter(x => !this.accessor!.memberOf?.includes(x.id)) ?? res;
                    this.accessor.memberOf = this.accessor?.memberOf?.concat(res.map(x => x.title)) ?? res.map(x => x.title);
                    this.groups = this.accessor?.memberOf?.map(x => this.createGroupFromDn(x)) ?? [];
                }
            });
    }

    deleteGroup() {
        if((this.groupList?.selected?.length ?? 0) > 0 && this.accessor) {
            this.groups = this.groups.filter(x => ((this.groupList?.selected?.findIndex(y => y.dn == x.dn) ?? -1) === -1));
            this.accessor.memberOf = this.accessor?.memberOf.filter(
                x =>  ((this.groupList?.selected?.findIndex(y => y.dn == x) ?? -1) === -1));
        }
    }

    async openGroupProperties() {
        if(!this.groupList?.selected?.[0]) {
            return;
        }
        const entity = <LdapEntity> await this.navigation.getEntityByDn(this.groupList.selected[0].dn);
        if(!entity) {
            return;
        }
        this.windows.openEntityProperiesModal(entity);
    }
}