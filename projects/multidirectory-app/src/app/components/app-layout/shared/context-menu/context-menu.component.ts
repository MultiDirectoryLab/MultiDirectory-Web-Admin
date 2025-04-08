import { AfterViewInit, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { DeleteEntryRequest } from '@models/entry/delete-request';
import { UpdateEntryResponse } from '@models/entry/update-response';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppWindowsService } from '@services/app-windows.service';
import { BulkService } from '@services/bulk.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DropdownMenuComponent } from 'multidirectory-ui-kit';
import { concat, EMPTY, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  imports: [DropdownMenuComponent, TranslocoPipe],
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
  private contextMenuService = inject(ContextMenuService);
  private windows = inject(AppWindowsService);
  private api = inject(MultidirectoryApiService);
  private navigation = inject(AppNavigationService);
  private bulk = inject<BulkService<LdapEntryNode>>(BulkService);
  private getAccessorStrategy = inject(GetAccessorStrategy);
  private completeUpdateEntiresStrategy = inject(CompleteUpdateEntiresStrategies);

  @ViewChild('contextMenu', { static: true }) contextMenuRef!: DropdownMenuComponent;
  LdapEntryType = LdapEntryType;
  entries: LdapEntryNode[] = [];
  accountEnabled = false;
  private unsubscribe = new Subject<void>();

  ngAfterViewInit(): void {
    this.contextMenuService.contextMenuOnNodeRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.entries = x.entries;
      this.setAccountEnabled();
      this.contextMenuRef.setPosition(x.openX, x.openY);
      this.contextMenuRef.open();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  isSelectedRowsOfType(...types: LdapEntryType[]): boolean {
    return this.entries.every((x) => types.includes(x.type));
  }

  isNotSelectedRowsOfTypeCatalog(): boolean {
    const catalog_types = [LdapEntryType.Folder, LdapEntryType.Root, LdapEntryType.OU];
    return this.entries.every((x) => !catalog_types.includes(x.type));
  }

  showEntryProperties() {
    if (this.entries.length <= 0) {
      return;
    }
    this.windows
      .openEntityProperiesModal(this.entries[0])
      .pipe(take(1))
      .subscribe((x) => {
        this.windows.closeEntityPropertiesModal(x);
      });
  }

  showChangePassword() {
    if (this.entries.length < 1) {
      return;
    }
    this.windows.openChangePasswordModal(this.entries[0]);
  }

  showDeleteConfirmation(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.windows
      .openDeleteEntryConfirmation(this.entries.map((x) => x.id))
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          concat(
            ...this.entries.map((x) =>
              this.api.delete(
                new DeleteEntryRequest({
                  entry: (<any>x.entry).object_name,
                }),
              ),
            ),
          ).subscribe((x) => {
            this.navigation.reload();
          });
        }
      });
  }

  showModifyDn(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const firstEntry = this.entries[0];
    this.windows
      .openModifyDn(firstEntry.id)
      .pipe(
        take(1),
        switchMap((x) => {
          if (x) {
            return this.api.updateDn(x);
          }
          return EMPTY;
        }),
      )
      .subscribe((modifyRequest) => {});
  }

  showMoveDialog(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.windows
      .openCopyEntityDialog(this.entries)
      .pipe(
        take(1),
        switchMap((x) => {
          if (x) {
            return this.api.updateDn(x);
          }
          return EMPTY;
        }),
      )
      .subscribe((modifyRequest) => {
        this.navigation.reload();
      });
  }

  enableAccunts(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.windows
      .openCopyEntityDialog(this.entries)
      .pipe(
        take(1),
        switchMap((x) => {
          if (x) {
            return this.api.updateDn(x);
          }
          return EMPTY;
        }),
      )
      .subscribe((modifyRequest) => {
        this.navigation.reload();
      });
  }

  setAccountEnabled() {
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

  toggleAccount(enabled: boolean) {
    const toChange = this.bulk
      .create(this.entries)
      .mutate<LdapAttributes>(this.getAccessorStrategy)
      .filter(new FilterControllableStrategy());

    const changed = '<ul>' + this.entries.map((x) => `<li>${x.id}</li>`).join('') + '</ul>';

    toChange
      .mutate<LdapAttributes>(new ToggleAccountDisableStrategy(enabled))
      .complete<UpdateEntryResponse>(this.completeUpdateEntiresStrategy)
      .pipe(take(1))
      .pipe(
        switchMap((x) => {
          let all =
            translate('toggle-account.accounts-was-toggled') +
            (enabled ? translate('toggle-account.enabled') : translate('toggle-account.disabled')) +
            ':';

          all += '<br/>' + changed;

          return this.windows.openConfirmDialog({
            promptText: all,
            promptHeader: translate('toggle-account.header'),
            primaryButtons: [{ id: 'ok', text: translate('toggle-account.ok') }],
            secondaryButtons: [],
          });
        }),
      )
      .subscribe((result) => {
        this.navigation.reload();
      });
  }
}
