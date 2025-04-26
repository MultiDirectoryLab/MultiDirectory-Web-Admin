import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { DropdownContainerDirective, DropdownMenuComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';
import { ChangePasswordDialogComponent } from '../modals/components/dialogs/change-password-dialog/change-password-dialog.component';
import { EntityPropertiesDialogComponent } from '../modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';
import {
  ChangePasswordDialogData,
  ChangePasswordDialogReturnData,
} from '../modals/interfaces/change-password-dialog.interface';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../modals/interfaces/entity-properties-dialog.interface';
import { DialogService } from '../modals/services/dialog.service';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [TranslocoDirective, RouterOutlet, DropdownContainerDirective, DropdownMenuComponent],
})
export class SidebarComponent {
  private dialogService: DialogService = inject(DialogService);
  private app: AppSettingsService = inject(AppSettingsService);
  private router: Router = inject(Router);

  public get user(): WhoamiResponse {
    return this.app.user;
  }

  public logout() {
    this.app
      .logout()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }

  public openAccountSettings() {
    if (!this.app.userEntry) {
      return;
    }

    this.dialogService.open<
      EntityPropertiesDialogReturnData,
      EntityPropertiesDialogData,
      EntityPropertiesDialogComponent
    >({
      component: EntityPropertiesDialogComponent,
      dialogConfig: {
        width: '600px',
        minHeight: '660px',
        data: { entity: this.app.userEntry },
      },
    });
  }

  public openChangePassword() {
    if (!this.app.userEntry) {
      return;
    }

    const { id: identity, name: un } = this.app.userEntry;

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
    });
  }

  public handleLogoClick() {
    this.router.navigate(['/ldap']);
  }
}
