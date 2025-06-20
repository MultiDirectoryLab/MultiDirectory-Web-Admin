import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { concat, EMPTY, of, switchMap, take } from 'rxjs';
import { ContextMenuService } from '../../../services/context-menu.service';
import { ContextMenuData } from '../../../interfaces/context-menu-dialog.interface';
import { BulkService } from '@services/bulk.service';
import { GetAccessorStrategy } from '@core/bulk/strategies/get-accessor-strategy';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { FilterControllableStrategy } from '@core/bulk/strategies/filter-controllable-strategy';
import { CheckAccountEnabledStateStrategy } from '@core/bulk/strategies/check-account-enabled-state-strategy';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../../../interfaces/entity-properties-dialog.interface';
import {
  ChangePasswordDialogData,
  ChangePasswordDialogReturnData,
} from '../../../interfaces/change-password-dialog.interface';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { ToggleAccountDisableStrategy } from '@core/bulk/strategies/toggle-account-disable-strategy';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../../interfaces/confirm-dialog.interface';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {
  MoveEntityDialogData,
  MoveEntityDialogReturnData,
} from '../../../interfaces/move-entity-dialog.interface';
import { MoveEntityDialogComponent } from '../../dialogs/move-entity-dialog/move-entity-dialog.component';
import {
  ConfirmDeleteDialogData,
  ConfirmDeleteDialogReturnData,
} from '../../../interfaces/confirm-delete-dialog.interface';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { CompleteUpdateEntiresStrategies } from '@core/bulk/strategies/complete-update-entires-strategy';
import { EntityPropertiesDialogComponent } from '../../dialogs/entity-properties-dialog/entity-properties-dialog.component';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { LdapEntryType } from '@models/core/ldap/ldap-entry-type';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { NavigationNode } from '@models/core/navigation/navigation-node';

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
  public LdapEntryType = LdapEntryType;
  public accountEnabled = false;

  private ngZone: NgZone = inject(NgZone);
  private contextMenuService: ContextMenuService = inject(ContextMenuService);
  private dialogService: DialogService = inject(DialogService);
  private api: MultidirectoryApiService = inject(MultidirectoryApiService);
  private bulk: BulkService<NavigationNode> = inject(BulkService<NavigationNode>);
  private getAccessorStrategy: GetAccessorStrategy = inject(GetAccessorStrategy);
  private completeUpdateEntiresStrategy: CompleteUpdateEntiresStrategies = inject(
    CompleteUpdateEntiresStrategies,
  );
  private contextMenuData: ContextMenuData = inject(DIALOG_DATA);
  /** OTHER **/
  public entries = this.contextMenuData.entity;

  public ngOnInit(): void {
    this.setAccountEnabled();

    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.handleOverflow();
    });
  }

  public openMoreDialog() {
    this.contextMenuService.close(
      this.dialogService
        .open<
          EntityPropertiesDialogReturnData,
          EntityPropertiesDialogData,
          EntityPropertiesDialogComponent
        >({
          component: EntityPropertiesDialogComponent,
          dialogConfig: {
            hasBackdrop: false,
            width: '600px',
            minHeight: '660px',
            data: { entity: this.entries[0] },
          },
        })
        .closed.pipe(take(1)),
    );
  }

  public openChangePasswordDialog() {
    const { id: identity, name: un } = this.entries[0];

    this.contextMenuService.close(
      this.dialogService.open<
        ChangePasswordDialogReturnData,
        ChangePasswordDialogData,
        ChangePasswordDialogComponent
      >({
        component: ChangePasswordDialogComponent,
        dialogConfig: {
          minHeight: '220px',
          height: '220px',
          data: { identity, un },
        },
      }).closed,
    );
  }

  public toggleAccount(enabled: boolean) {
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
              (enabled
                ? translate('toggle-account.enabled')
                : translate('toggle-account.disabled')) +
              ':';

            promptText +=
              '<br/><ul>' + this.entries.map((x) => `<li>${x.id}</li>`).join('') + '</ul>';

            return this.dialogService.open<
              ConfirmDialogReturnData,
              ConfirmDialogData,
              ConfirmDialogComponent
            >({
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
        ),
    );
  }

  public openMoveDialog() {
    this.contextMenuService.close(
      this.dialogService
        .open<MoveEntityDialogReturnData, MoveEntityDialogData, MoveEntityDialogComponent>({
          component: MoveEntityDialogComponent,
          dialogConfig: {
            minHeight: '230px',
            data: { toMove: this.entries },
          },
        })
        .closed.pipe(switchMap((x) => (x ? this.api.updateDn(x) : EMPTY))),
    );
  }

  public openConfirmDeleteDialog() {
    this.contextMenuService.close(
      this.dialogService
        .open<ConfirmDeleteDialogReturnData, ConfirmDeleteDialogData, ConfirmDeleteDialogComponent>(
          {
            component: ConfirmDeleteDialogComponent,
            dialogConfig: {
              width: '580px',
              data: { toDeleteDNs: this.entries.map((x) => x.id) },
            },
          },
        )
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
        ),
    );
  }

  public isSelectedRowsOfType(...types: LdapEntryType[]): boolean {
    return this.entries.every((x) => types.includes(LdapEntryType.Computer));
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
