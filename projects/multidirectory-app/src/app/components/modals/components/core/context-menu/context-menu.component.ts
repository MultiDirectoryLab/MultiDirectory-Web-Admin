import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { LdapEntryType } from '@models/core/ldap/ldap-entry-type';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppSettingsService } from '@services/app-settings.service';
import { BulkService } from '@services/bulk.service';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { concat, EMPTY, of, switchMap, take, tap } from 'rxjs';
import { ChangePasswordDialogData, ChangePasswordDialogReturnData } from '../../../interfaces/change-password-dialog.interface';
import { ConfirmDeleteDialogData, ConfirmDeleteDialogReturnData } from '../../../interfaces/confirm-delete-dialog.interface';
import { ConfirmDialogData, ConfirmDialogReturnData } from '../../../interfaces/confirm-dialog.interface';
import { ContextMenuData } from '../../../interfaces/context-menu-dialog.interface';
import { EntityPropertiesDialogData, EntityPropertiesDialogReturnData } from '../../../interfaces/entity-properties-dialog.interface';
import { MoveEntityDialogData, MoveEntityDialogReturnData } from '../../../interfaces/move-entity-dialog.interface';
import { ContextMenuService } from '../../../services/context-menu.service';
import { DialogService } from '../../../services/dialog.service';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { EntityPropertiesDialogComponent } from '../../dialogs/entity-properties-dialog/entity-properties-dialog.component';
import { MoveEntityDialogComponent } from '../../dialogs/move-entity-dialog/move-entity-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [MultidirectoryUiKitModule, TranslocoPipe],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent implements OnInit {
  @ViewChild('dropdown', { static: true }) dropdown!: ElementRef<HTMLDivElement>;
  LdapEntryType = LdapEntryType;
  accountEnabled = false;

  private ngZone: NgZone = inject(NgZone);
  private contextMenuService: ContextMenuService = inject(ContextMenuService);
  private dialogService: DialogService = inject(DialogService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private appSettings: AppSettingsService = inject(AppSettingsService);
  private ldapTreeview = inject(LdapTreeviewService);
  private navigation = inject(AppNavigationService);
  private bulk: BulkService<NavigationNode> = inject(BulkService<NavigationNode>);
  private toastr = inject(ToastrService);
  private getAccessorStrategy: GetAccessorStrategy = inject(GetAccessorStrategy);
  private completeUpdateEntiresStrategy: CompleteUpdateEntiresStrategies = inject(CompleteUpdateEntiresStrategies);
  private contextMenuData: ContextMenuData = inject(DIALOG_DATA);
  /** OTHER **/
  entries = this.contextMenuData.entity;

  ngOnInit(): void {
    this.setAccountEnabled();
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.handleOverflow();
    });
  }

  openMoreDialog() {
    this.contextMenuService.close(null);

    this.dialogService.open<EntityPropertiesDialogReturnData, EntityPropertiesDialogData, EntityPropertiesDialogComponent>({
      component: EntityPropertiesDialogComponent,
      dialogConfig: {
        hasBackdrop: false,
        width: '600px',
        minHeight: '660px',
        data: { entity: this.entries[0] },
      },
    });
  }

  openChangePasswordDialog() {
    const user = this.entries[0];
    const me = this.appSettings.me(user.id);
    const height = me ? `530px` : `500px`;

    this.contextMenuService.close(null);

    this.dialogService.open<ChangePasswordDialogReturnData, ChangePasswordDialogData, ChangePasswordDialogComponent>({
      component: ChangePasswordDialogComponent,
      dialogConfig: {
        minHeight: height,
        width: '550px',
        data: { un: user.name, identity: user.id, me: me },
      },
    });
  }

  resetPasswordHistory() {
    this.api.resetPasswordHistory().subscribe(() => {
      this.toastr.success(
        translate('catalog-content.reset-password-history-success')
      );
    });
  }

  toggleAccount(enabled: boolean) {
    this.contextMenuService.close(
      this.bulk
        .create(this.entries)
        .mutate<LdapAttributes>(this.getAccessorStrategy)
        .filter(new FilterControllableStrategy())
        .mutate<LdapAttributes>(new ToggleAccountDisableStrategy(enabled))
        .complete<UpdateEntryResponse>(this.completeUpdateEntiresStrategy)
        .pipe(
          take(1),
          switchMap(() => {
            let promptText =
              translate('toggle-account.accounts-was-toggled') +
              (enabled ? translate('toggle-account.enabled') : translate('toggle-account.disabled')) +
              ':';

            promptText += '<br/><ul>' + this.entries.map((x) => `<li>${x.id}</li>`).join('') + '</ul>';

            return this.dialogService.open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
              component: ConfirmDialogComponent,
              dialogConfig: {
                minHeight: '160px',
                data: {
                  promptText,
                  promptHeader: translate('toggle-account.header'),
                  primaryButtons: [{ id: 'ok', text: translate('toggle-account.ok') }],
                  secondaryButtons: [],
                },
              },
            }).closed;
          }),
          tap(() => this.navigation.reload()),
        ),
    );
  }

  openMoveDialog() {
    this.contextMenuService.close(null);
    this.dialogService
      .open<MoveEntityDialogReturnData, MoveEntityDialogData, MoveEntityDialogComponent>({
        component: MoveEntityDialogComponent,
        dialogConfig: {
          minHeight: '230px',
          data: { toMove: this.entries },
        },
      })
      .closed.pipe(switchMap((x) => (x ? this.api.updateDn(x) : EMPTY)))
      .subscribe((x) => {
        this.navigation.reload();
      });
  }

  openConfirmDeleteDialog() {
    const toDeleteDNs = this.entries.map((x) => x.id);
    this.contextMenuService.close(null);
    this.dialogService
      .open<ConfirmDeleteDialogReturnData, ConfirmDeleteDialogData, ConfirmDeleteDialogComponent>({
        component: ConfirmDeleteDialogComponent,
        dialogConfig: {
          width: '580px',
          data: { toDeleteDNs: toDeleteDNs },
        },
      })
      .closed.pipe(
        switchMap((isConfirmed) => {
          return isConfirmed
            ? concat(
                ...this.entries.map((x) =>
                  // TODO: Будет deleteMany
                  this.api.delete(
                    new DeleteEntryRequest({
                      entry: x.id,
                    }),
                  ),
                ),
              )
            : of(null);
        }),
      )
      .subscribe((result) => {
        this.ldapTreeview.invalidate(toDeleteDNs);
        this.navigation.reload();
      });
  }

  isSelectedRowsOfType(...types: LdapEntryType[]): boolean {
    const objectClasses = this.entries.map(
      (x) => (x.attributes || []).find((y) => y.type.toLocaleLowerCase() == 'objectclass')?.vals ?? [],
    );
    const nodeTypes = objectClasses.map((x) => EntityInfoResolver.getNodeType(x));
    return nodeTypes.every((x) => types.includes(x));
  }

  private setAccountEnabled() {
    this.bulk
      .create(this.entries)
      .mutate<LdapAttributes>(this.getAccessorStrategy)
      .filter(new FilterControllableStrategy())
      .complete<boolean>(new CheckAccountEnabledStateStrategy())
      .pipe(take(1))
      .subscribe((result) => {
        this.accountEnabled = result;
      });
  }

  private handleOverflow(): void {
    const dropdownEl = this.dropdown.nativeElement;
    const dropdownRect: DOMRect = dropdownEl.getBoundingClientRect();

    const offsetX = window.innerWidth - (dropdownRect.x + dropdownRect.width);
    const offsetY = window.innerHeight - (dropdownRect.y + dropdownRect.height);

    dropdownEl.style.transform = `translate(${offsetX < 0 ? offsetX : 0}px, ${offsetY < 0 ? offsetY : 0}px)`;
  }
}
