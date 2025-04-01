import { Component, inject, Input, ViewChild } from '@angular/core';
import { DatagridComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { Constants } from '@core/constants';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { Member } from '@core/groups/member';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { AppWindowsService } from '@services/app-windows.service';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { take } from 'rxjs';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
  EntitySelectorSettings,
} from '../../../components/modals/interfaces/entity-selector-dialog.interface';
import { EntitySelectorDialogComponent } from '../../../components/modals/components/dialogs/entity-selector-dialog/entity-selector-dialog.component';
import { DialogService } from '../../../components/modals/services/dialog.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  standalone: true,
  imports: [TranslocoPipe, MultidirectoryUiKitModule],
})
export class MembersComponent {
  members: Member[] = [];
  @ViewChild('groupList') memberList?: DatagridComponent;
  columns = [
    { name: translate('members.name'), prop: 'name', flexGrow: 1 },
    { name: translate('members.catalog-path'), prop: 'path', flexGrow: 3 },
  ];
  private dialogService: DialogService = inject(DialogService);

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

    this.dialogService
      .open<
        EntitySelectorDialogReturnData,
        EntitySelectorDialogData,
        EntitySelectorDialogComponent
      >({
        component: EntitySelectorDialogComponent,
        dialogConfig: {
          minHeight: '360px',
          data: new EntitySelectorSettings({
            selectedEntities: [],
            selectedEntityTypes: ENTITY_TYPES.filter((x) => types.includes(x.entity)) ?? [],
            allowSelectEntityTypes: false,
          }),
        },
      })
      .closed.pipe(take(1))
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
