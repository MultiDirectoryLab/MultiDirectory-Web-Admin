import { Component, Input, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { DatagridComponent } from 'multidirectory-ui-kit';
import { Group } from '@core/groups/group';
import { Constants } from '@core/constants';
import { translate } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { AttributeService } from '@services/attributes.service';
import { AppNavigationService } from '@services/app-navigation.service';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntitySelectorSettings } from '@features/forms/entity-selector/entity-selector-settings.component';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';

@Component({
  selector: 'app-member-of',
  templateUrl: './member-of.component.html',
  styleUrls: ['./member-of.component.scss'],
})
export class MemberOfComponent {
  private _accessor: LdapAttributes | null = null;
  groups: Group[] = [];
  @ViewChild('groupList') groupList?: DatagridComponent;

  @Input() set accessor(accessor: LdapAttributes | null) {
    if (!accessor) {
      this._accessor = null;
      return;
    }
    this._accessor = accessor;
    this.groups = this._accessor.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
  }

  get accessor(): LdapAttributes | null {
    return this._accessor;
  }

  columns = [
    { name: translate('member-of.name'), prop: 'name', flexGrow: 1 },
    { name: translate('member-of.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  constructor(
    private windows: AppWindowsService,
    private navigation: AppNavigationService,
    private attributes: AttributeService,
  ) {}

  private createGroupFromDn(dn: string) {
    const name = new RegExp(Constants.RegexGetNameFromDn).exec(dn);
    const path = new RegExp(Constants.RegexGetPathFormDn).exec(dn);
    return new Group({
      name: name?.[1] ?? '',
      path: path?.[1] ?? '',
      dn: dn,
    });
  }

  addGroup() {
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
          res = res.filter((x) => !this.accessor!.memberOf?.includes(x.id)) ?? res;
          this.accessor.memberOf =
            this.accessor?.memberOf?.concat(res.map((x) => x.id)) ?? res.map((x) => x.id);
          this.groups = this.accessor?.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
        }
      });
  }

  deleteGroup() {
    if ((this.groupList?.selected?.length ?? 0) > 0 && this.accessor) {
      this.groups = this.groups.filter(
        (x) => (this.groupList?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
      );
      this.accessor.memberOf = this.accessor?.memberOf?.filter(
        (x) => (this.groupList?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
      );
    }
  }

  async openGroupProperties() {
    if (!this.groupList?.selected?.[0]) {
      return;
    }
    const entity = <LdapEntryNode>await this.navigation.goTo(this.groupList.selected[0].dn);
    if (!entity) {
      return;
    }
    this.windows.openEntityProperiesModal(entity);
  }
}
