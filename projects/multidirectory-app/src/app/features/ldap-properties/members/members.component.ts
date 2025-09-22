import { ChangeDetectorRef, Component, inject, Input, viewChild } from '@angular/core';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Member } from '@core/groups/member';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { from, take } from 'rxjs';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
  EntitySelectorSettings,
} from '../../../components/modals/interfaces/entity-selector-dialog.interface';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { EntitySelectorDialogComponent } from '@features/entity-selector/entity-selector-dialog/entity-selector-dialog.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  imports: [DatagridComponent, TranslocoPipe, ButtonComponent],
})
export class MembersComponent {
  private cdr = inject(ChangeDetectorRef);
  private ldapTreeview = inject(LdapTreeviewService);
  private dialogService: DialogService = inject(DialogService);
  members: Member[] = [];
  readonly memberList = viewChild<DatagridComponent>('groupList');
  columns = [
    { name: translate('members.name'), prop: 'name', flexGrow: 1 },
    { name: translate('members.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  private _accessor: LdapAttributes = new LdapAttributes([]);

  get accessor(): LdapAttributes {
    return this._accessor;
  }

  @Input() set accessor(accessor: LdapAttributes) {
    this._accessor = accessor;
    this.members = this._accessor.member?.map((x) => this.createMemberFromDn(x)) ?? [];
  }

  addMember() {
    const types = ['group', 'user'];
    from(this.ldapTreeview.load(''))
      .pipe(take(1))
      .subscribe((ldapTree) => {
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
                selectedPlaceDn: ldapTree[0].id,
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
              this.cdr.detectChanges();
            }
          });
      });
  }

  deleteMember() {
    this.members = this.members.filter(
      (x) => (this.memberList()?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
    );
    this.accessor.member = this.accessor?.member?.filter(
      (x) => (this.memberList()?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
    );
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
