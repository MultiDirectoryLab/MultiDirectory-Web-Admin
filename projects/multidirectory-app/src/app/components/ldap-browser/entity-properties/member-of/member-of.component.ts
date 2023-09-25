import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { GroupSelectorComponent } from "../../../forms/group-selector/group-selector.component";
import { take } from "rxjs";
import { DatagridComponent } from "multidirectory-ui-kit";

@Component({
    selector: 'app-member-of',
    templateUrl: './member-of.component.html',
    styleUrls: ['./member-of.component.scss']
})
export class MemberOfComponent implements AfterViewInit {
    private _accessor: LdapAttributes | null = null;
    groups: { name: string, path: string }[] = [];
    @ViewChild('groupSelector') groupSelector?: GroupSelectorComponent;
    @ViewChild('groupList') groupList?: DatagridComponent;

    @Input() set accessor(accessor: LdapAttributes | null) {
        if(!accessor) {
            this._accessor = null;
            return;
        }
        this._accessor = accessor; 
        this.groups = this._accessor.memberOf?.map(x => ({ name: x, path: x })) ?? [];
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
        this.groupSelector?.open()
            .pipe(take(1))
            .subscribe(res => {
                if(res && !!this.accessor) {
                    res = res.filter(x => !this.accessor!.memberOf?.includes(x.id)) ?? res;
                    this.accessor.memberOf = this.accessor?.memberOf?.concat(res.map(x => x.title)) ?? res.map(x => x.title);
                    this.groups = this.accessor?.memberOf?.map(x => ({ name: x, path: x })) ?? [];
                }
            });
    }
    deleteGroup() {
        if((this.groupList?.selected?.length ?? 0) > 0 && this.accessor) {
            this.groups = this.groups.filter(x => ((this.groupList?.selected?.findIndex(y => y.name == x.name) ?? -1) === -1));
            this.accessor.memberOf = this.accessor?.memberOf.filter(x =>  ((this.groupList?.selected?.findIndex(y => y.name == x) ?? -1) === -1));
        }
    }
}