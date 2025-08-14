import { ChangeDetectorRef, Component, inject, Input, viewChild } from '@angular/core';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Group } from '@core/groups/group';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { from, take } from 'rxjs';
import { EntitySelectorDialogComponent } from '../../../components/modals/components/dialogs/entity-selector-dialog/entity-selector-dialog.component';
import {
  EntitySelectorDialogData,
  EntitySelectorDialogReturnData,
} from '../../../components/modals/interfaces/entity-selector-dialog.interface';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';

@Component({
  selector: 'app-member-of',
  templateUrl: './member-of.component.html',
  styleUrls: ['./member-of.component.scss'],
  imports: [TranslocoPipe, DatagridComponent, ButtonComponent],
})
export class MemberOfComponent {
  private dialogService: DialogService = inject(DialogService);
  private ldapTreeview: LdapTreeviewService = inject(LdapTreeviewService);
  private cdr = inject(ChangeDetectorRef);
  readonly groupList = viewChild<DatagridComponent>('groupList');
  groups: Group[] = [];
  columns = [
    { name: translate('member-of.name'), prop: 'name', flexGrow: 1 },
    { name: translate('member-of.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  private _accessor: LdapAttributes = new LdapAttributes([]);

  get accessor(): LdapAttributes {
    return this._accessor;
  }

  @Input() set accessor(accessor: LdapAttributes) {
    this._accessor = accessor;
    this.groups = this._accessor.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
  }

  addGroup() {
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
              data: {
                selectedEntities: [],
                selectedEntityTypes: ENTITY_TYPES.filter((x) => types.includes(x.entity)) ?? [],
                allowSelectEntityTypes: false,
                entityToMove: [],
                selectedPlaceDn: ldapTree[0].id,
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
              this.cdr.detectChanges();
            }
          });
      });
  }

  deleteGroup() {
    this.groups = this.groups.filter(
      (x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1,
    );
    this.accessor.memberOf = this.accessor.memberOf.filter(
      (x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1,
    );
  }

  openGroupProperties() {
    const groupList = this.groupList();
    if (!groupList?.selected?.[0]) {
      return;
    }
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
