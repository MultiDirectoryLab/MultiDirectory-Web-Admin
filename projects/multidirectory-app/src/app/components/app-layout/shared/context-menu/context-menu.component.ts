import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { DropdownMenuComponent } from 'multidirectory-ui-kit';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryType } from '@core/ldap/ldap-entity-type';
import { DeleteEntryRequest } from '@models/entry/delete-request';
import { AppNavigationService } from '@services/app-navigation.service';
import { AppWindowsService } from '@services/app-windows.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { EMPTY, Subject, concat, switchMap, take, takeUntil } from 'rxjs';
import { BulkService } from '@services/bulk.service';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import { UpdateEntryResponse } from '@models/entry/update-response';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('contextMenu', { static: true }) contextMenuRef!: DropdownMenuComponent;
  private unsubscribe = new Subject<void>();
  LdapEntryType = LdapEntryType;
  entries: LdapEntryNode[] = [];
  constructor(
    private contextMenuService: ContextMenuService,
    private windows: AppWindowsService,
    private api: MultidirectoryApiService,
    private navigation: AppNavigationService,
    private bulk: BulkService<LdapEntryNode>,
    private getAccessorStrategy: GetAccessorStrategy,
    private completeUpdateEntiresStrategy: CompleteUpdateEntiresStrategies,
  ) {}

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

  isSelectedRowsOfType(type: LdapEntryType): boolean {
    return this.entries.every((x) => x.type == type);
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

  accountEnabled = false;
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

    toChange
      .mutate<LdapAttributes>(new ToggleAccountDisableStrategy(enabled))
      .complete<UpdateEntryResponse>(this.completeUpdateEntiresStrategy)
      .pipe(take(1))
      .subscribe((result) => {
        this.navigation.reload();
        alert('test');
      });
  }
}
