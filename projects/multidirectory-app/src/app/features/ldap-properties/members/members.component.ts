import { Component, Input, ViewChild } from '@angular/core';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Member } from '@core/groups/member';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntitySelectorSettings } from '@features/forms/entity-selector/entity-selector-settings.component';
import { EntitySelectorComponent } from '@features/forms/entity-selector/entity-selector.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  imports: [TranslocoPipe, DatagridComponent, ButtonComponent],
})
export class MembersComponent {
  members: Member[] = [];
  @ViewChild('groupSelector') memberSelector?: EntitySelectorComponent;
  @ViewChild('groupList') memberList?: DatagridComponent;
  columns = [
    { name: translate('members.name'), prop: 'name', flexGrow: 1 },
    { name: translate('members.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  constructor(private windows: AppWindowsService) {}

  private _accessor: LdapAttributes | null = null;

  get accessor(): LdapAttributes | null {
    return this._accessor;
  }

  @Input() set accessor(accessor: LdapAttributes | null) {
    if (!accessor) {
      this._accessor = null;
      return;
    }
    this._accessor = accessor;
    this.members = this._accessor.member?.map((x) => this.createMemberFromDn(x)) ?? [];
  }

  addMember() {
    const types = ['group', 'user'];
    this.windows
      ?.openEntitySelector(
        new EntitySelectorSettings({
          selectedEntities: [],
          selectedEntityTypes: ENTITY_TYPES.filter((x) => types.includes(x.entity)) ?? [],
          allowSelectEntityTypes: false,
        }),
      )
      .pipe(take(1))
      .subscribe((res) => {
        if (res && !!this.accessor) {
          res = res.filter((x) => !this.accessor!.member?.includes(x.id)) ?? res;
          this.accessor.member =
            this.accessor?.member?.concat(res.map((x) => x.id)) ?? res.map((x) => x.id);
          this.members = this.accessor?.member?.map((x) => this.createMemberFromDn(x)) ?? [];
        }
      });
  }

  deleteMember() {
    if ((this.memberList?.selected?.length ?? 0) > 0 && this.accessor) {
      this.members = this.members.filter(
        (x) => (this.memberList?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
      );
      this.accessor.member = this.accessor?.memberOf?.filter(
        (x) => (this.memberList?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
      );
    }
  }

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
