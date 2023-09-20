import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { GroupSelectorComponent } from "../../../forms/group-selector/group-selector.component";

@Component({
    selector: 'app-member-of',
    templateUrl: './member-of.component.html',
    styleUrls: ['./member-of.component.scss']
})
export class MemberOfComponent implements AfterViewInit {
    private _accessor: LdapAttributes | null = null;
    groups: { name: string, path: string }[] = [];
    @ViewChild('groupSelector') groupSelector?: GroupSelectorComponent;

    @Input() set accessor(accessor: LdapAttributes | null) {
        if(!accessor) {
            this._accessor = null;
            return;
        }
        this._accessor = accessor; 
        this.groups = this._accessor.memberOf.map(x => ({ name: x, path: x }));
    }
    get accessor(): LdapAttributes | null{
        return this._accessor;
    }

    columns = [
        { name: 'Имя',  prop: 'name',  flexGrow: 1 },
        { name: 'Каталог в домене Multidirectory',  prop: 'path',  flexGrow: 3 },
    ];

    ngAfterViewInit(): void {
         
    }

    addGroup() {
        this.groupSelector?.open();
    }
}