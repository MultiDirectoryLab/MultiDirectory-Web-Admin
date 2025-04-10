import { Component, inject, Input, viewChild } from '@angular/core';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Group } from '@core/groups/group';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { EntitySelectorSettings } from '@features/forms/entity-selector/entity-selector-settings.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppWindowsService } from '@services/app-windows.service';
import { AttributeService } from '@services/attributes.service';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-of',
  templateUrl: './member-of.component.html',
  styleUrls: ['./member-of.component.scss'],
  imports: [TranslocoPipe, DatagridComponent, ButtonComponent],
})
export class MemberOfComponent {
  private windows = inject(AppWindowsService);
  private navigation = inject(AppNavigationService);
  private attributes = inject(AttributeService);

  groups: Group[] = [];
  readonly groupList = viewChild<DatagridComponent>('groupList');
  columns = [
    { name: translate('member-of.name'), prop: 'name', flexGrow: 1 },
    { name: translate('member-of.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

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
    this.groups = this._accessor.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
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
    if ((this.groupList()?.selected?.length ?? 0) > 0 && this.accessor) {
      this.groups = this.groups.filter(
        (x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
      );
      this.accessor.memberOf = this.accessor?.memberOf?.filter(
        (x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
      );
    }
  }

  async openGroupProperties() {
    const groupList = this.groupList();
    if (!groupList?.selected?.[0]) {
      return;
    }
    const entity = <LdapEntryNode>await this.navigation.goTo(groupList.selected[0].dn);
    if (!entity) {
      return;
    }
    this.windows.openEntityProperiesModal(entity);
  }

  private createGroupFromDn(dn: string) {
    const name = new RegExp(Constants.RegexGetNameFromDn).exec(dn);
    const path = new RegExp(Constants.RegexGetPathFormDn).exec(dn);
    return new Group({
      name: name?.[1] ?? '',
      path: path?.[1] ?? '',
      dn: dn,
    });
  }
}
