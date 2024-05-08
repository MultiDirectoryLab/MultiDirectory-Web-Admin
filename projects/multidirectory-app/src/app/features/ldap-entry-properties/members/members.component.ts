import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-entity-proxy';
import { DatagridComponent } from 'multidirectory-ui-kit';
import { Constants } from '@core/constants';
import { translate } from '@ngneat/transloco';
import { Member } from '@core/groups/member';
import { EntitySelectorComponent } from '@features/forms/entity-selector/entity-selector.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements AfterViewInit {
  private _accessor: LdapAttributes | null = null;
  members: Member[] = [];
  @ViewChild('groupSelector') groupSelector?: EntitySelectorComponent;
  @ViewChild('groupList') groupList?: DatagridComponent;

  @Input() set accessor(accessor: LdapAttributes | null) {
    if (!accessor) {
      this._accessor = null;
      return;
    }
    this._accessor = accessor;
    this.members = this._accessor.member?.map((x) => this.createMemberFromDn(x)) ?? [];
  }

  get accessor(): LdapAttributes | null {
    return this._accessor;
  }

  columns = [
    { name: translate('members.name'), prop: 'name', flexGrow: 1 },
    { name: translate('members.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  ngAfterViewInit(): void {}

  private createMemberFromDn(dn: string) {
    const name = new RegExp(Constants.RegexGetNameFromDn).exec(dn);
    const path = new RegExp(Constants.RegexGetPathFormDn).exec(dn);
    return new Member({
      name: name?.[1] ?? '',
      path: path?.[1] ?? '',
      dn: dn,
    });
  }
}
