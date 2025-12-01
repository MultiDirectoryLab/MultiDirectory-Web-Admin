import { ChangeDetectorRef, Component, inject, Input, viewChild } from '@angular/core';
import { Constants } from '@core/constants';
import { ENTITY_TYPES } from '@core/entities/entities-available-types';
import { Group } from '@core/groups/group';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, DatagridComponent } from 'multidirectory-ui-kit';
import { from, take } from 'rxjs';
import { EntitySelectorDialogData, EntitySelectorDialogReturnData } from '@components/modals/interfaces/entity-selector-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { EntitySelectorDialogComponent } from '@features/entity-selector/entity-selector-dialog/entity-selector-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { SetPrimaryGroupRequest } from '@models/api/entry/set-primary-group-request';

@Component({
  selector: 'app-member-of',
  templateUrl: './member-of.component.html',
  styleUrls: ['./member-of.component.scss'],
  imports: [TranslocoPipe, DatagridComponent, ButtonComponent],
})
export class MemberOfComponent {
  private _accessor: LdapAttributes = new LdapAttributes([]);

  get accessor(): LdapAttributes {
    return this._accessor;
  }

  @Input() set accessor(accessor: LdapAttributes) {
    this._accessor = accessor;
    this.groups = this._accessor.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
  }

  protected groups: Group[] = [];
  protected columns = [
    { name: translate('member-of.name'), prop: 'name', flexGrow: 1 },
    { name: translate('member-of.catalog-path'), prop: 'path', flexGrow: 3 },
  ];

  private readonly groupList = viewChild<DatagridComponent>('groupList');

  private dialogService: DialogService = inject(DialogService);
  private ldapTreeview: LdapTreeviewService = inject(LdapTreeviewService);
  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private api = inject(MultidirectoryApiService);

  protected get accessorHasPrimaryGroup(): boolean {
    return !!this.accessor.primaryGroupID;
  }

  protected get groupSelected(): boolean {
    return !!this.groupList()?.selected?.length;
  }

  protected addGroup() {
    const types = ['group', 'user'];

    from(this.ldapTreeview.load(''))
      .pipe(take(1))
      .subscribe((ldapTree) => {
        this.dialogService
          .open<EntitySelectorDialogReturnData, EntitySelectorDialogData, EntitySelectorDialogComponent>({
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
              this.accessor.memberOf = this.accessor?.memberOf?.concat(res.map((x) => x.id)) ?? res.map((x) => x.id);
              this.groups = this.accessor?.memberOf?.map((x) => this.createGroupFromDn(x)) ?? [];
              this.cdr.detectChanges();
            }
          });
      });
  }

  protected deleteGroup() {
    this.groups = this.groups.filter((x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x.dn) ?? -1) === -1);
    this.accessor.memberOf = this.accessor.memberOf.filter((x) => (this.groupList()?.selected?.findIndex((y) => y.dn == x) ?? -1) === -1);
  }

  protected updateGroup() {
    const selectedGroups: Group[] | undefined = this.groupList()?.selected;
    const dn: string | undefined = this.accessor.distinguishedName[0];

    if (selectedGroups && this.groupSelected && dn) {
      if (selectedGroups.length > 1) {
        this.toastr.warning(translate('member-of.update-group-length-error'));
      } else {
        const selectedGroupDn = selectedGroups[0].dn;
        selectedGroupDn && this.setPrimaryGroup(dn, selectedGroupDn);
      }
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

  private setPrimaryGroup(directoryDn: string, groupDn: string) {
    const payload: SetPrimaryGroupRequest = {
      directory_dn: directoryDn,
      group_dn: groupDn,
    };

    this.api.setPrimaryGroup(payload).subscribe({
      next: () => {
        this.toastr.success(translate('member-of.primary-group-updated', { group: groupDn }));
      },
      error: () => {
        this.toastr.error(translate('member-of.primary-group-update-error', { group: groupDn }));
      },
    });
  }
}
