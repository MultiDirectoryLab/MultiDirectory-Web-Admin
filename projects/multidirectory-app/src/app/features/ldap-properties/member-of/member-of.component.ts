import { Component, inject, Input, viewChild } from '@angular/core';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Group } from '@core/groups/group';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';
import { EntityPropertiesDialogComponent } from '../../../components/modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';
import { EntitySelectorDialogComponent } from '../../../components/modals/components/dialogs/entity-selector-dialog/entity-selector-dialog.component';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../../../components/modals/interfaces/entity-properties-dialog.interface';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
} from '../../../components/modals/interfaces/entity-selector-dialog.interface';
import { DialogService } from '../../../components/modals/services/dialog.service';

@Component({
  selector: 'app-member-of',
  templateUrl: './member-of.component.html',
  styleUrls: ['./member-of.component.scss'],
  imports: [TranslocoPipe, DatagridComponent, ButtonComponent],
})
export class MemberOfComponent {
  private dialogService: DialogService = inject(DialogService);
  private navigation: AppNavigationService = inject(AppNavigationService);
  readonly groupList = viewChild<DatagridComponent>('groupList');
  public groups: Group[] = [];
  public columns = [
    { name: translate('member-of.name'), prop: 'name', flexGrow: 1 },
    { name: translate('member-of.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  private _accessor: LdapAttributes | null = null;

  public get accessor(): LdapAttributes | null {
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

  public addGroup() {
    const types = ['group', 'user'];

    this.dialogService
      .open<
        EntitySelectorDialogReturnData,
        EntitySelectorDialogData,
        EntitySelectorDialogComponent
      >({
        component: EntitySelectorDialogComponent,
        dialogConfig: {
          data: {
            selectedEntities: [],
            selectedEntityTypes: ENTITY_TYPES.filter((x) => types.includes(x.entity)) ?? [],
            allowSelectEntityTypes: false,
            entityToMove: [],
            selectedPlaceDn: '',
          },
        },
      })
      .closed.pipe(take(1))
      .subscribe((res) => {
        if (res && !!this.accessor) {
          res = res.filter((x) => !this.accessor!.memberOf?.includes(x.id)) ?? res;
          this.accessor.memberOf =
            this.accessor?.memberOf?.concat(res.map((x) => x.id)) ?? res.map((x) => x.id);
          this.groups = this.accessor?.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
        }
      });
  }

  public deleteGroup() {
    if ((this.groupList()?.selected?.length ?? 0) > 0 && this.accessor) {
      this.groups = this.groups.filter(
        (x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
      );
      this.accessor.memberOf = this.accessor?.memberOf?.filter(
        (x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
      );
    }
  }

  public async openGroupProperties() {
    const groupList = this.groupList();
    if (!groupList?.selected?.[0]) {
      return;
    }
    const entity = (await this.navigation.goTo(groupList.selected[0].dn)) as LdapEntryNode;
    if (!entity) {
      return;
    }
    // this.windows.openEntityProperiesModal(entity);
    this.dialogService.open<
      EntityPropertiesDialogReturnData,
      EntityPropertiesDialogData,
      EntityPropertiesDialogComponent
    >({
      component: EntityPropertiesDialogComponent,
      dialogConfig: {
        width: '600px',
        minHeight: '660px',
        data: { entity },
      },
    });
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
