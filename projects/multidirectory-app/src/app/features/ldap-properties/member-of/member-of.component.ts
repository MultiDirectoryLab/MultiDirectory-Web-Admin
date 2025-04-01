import { Component, inject, Input, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { DatagridComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { Group } from '@core/groups/group';
import { Constants } from '@core/constants';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { EntitySelectorDialogComponent } from '../../../components/modals/components/dialogs/entity-selector-dialog/entity-selector-dialog.component';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
} from '../../../components/modals/interfaces/entity-selector-dialog.interface';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../../../components/modals/interfaces/entity-properties-dialog.interface';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { EntityPropertiesDialogComponent } from '../../../components/modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';

@Component({
  selector: 'app-member-of',
  templateUrl: './member-of.component.html',
  styleUrls: ['./member-of.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule, TranslocoPipe],
})
export class MemberOfComponent {
  @ViewChild('groupList') groupList?: DatagridComponent;
  public groups: Group[] = [];
  public columns = [
    { name: translate('member-of.name'), prop: 'name', flexGrow: 1 },
    { name: translate('member-of.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  private dialogService: DialogService = inject(DialogService);
  private navigation: AppNavigationService = inject(AppNavigationService);

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
    if ((this.groupList?.selected?.length ?? 0) > 0 && this.accessor) {
      this.groups = this.groups.filter(
        (x) => (this.groupList?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
      );
      this.accessor.memberOf = this.accessor?.memberOf?.filter(
        (x) => (this.groupList?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
      );
    }
  }

  public async openGroupProperties() {
    if (!this.groupList?.selected?.[0]) {
      return;
    }
    const entity = <LdapEntryNode>await this.navigation.goTo(this.groupList.selected[0].dn);
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
