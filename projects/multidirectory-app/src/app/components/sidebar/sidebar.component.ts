import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { translate, TranslocoDirective } from '@jsverse/transloco';
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
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    TranslocoDirective,
    RouterOutlet,
    DropdownContainerDirective,
    DropdownMenuComponent,
    FormsModule,
    NgClass,
    FaIconComponent,
  ],
})
export class SidebarComponent {
  private dialogService: DialogService = inject(DialogService);
  private app: AppSettingsService = inject(AppSettingsService);
  private router: Router = inject(Router);
  private hotkeysService = inject(HotkeysService);
  $sidebarVisibility = this.app.multidirectorySidebarVisibleRx.value;
  constructor() {
    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+h', 'meta+h'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-navbar'),
      ),
    );
  }

  get user(): WhoamiResponse {
    return this.app.user;
  }

  logout() {
    this.app
      .logout()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }

  toggleSidebar() {
    this.app.sidebarVisibility = !this.app.sidebarVisibility;
  }

  openAccountSettings() {
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

  openChangePassword() {
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

  handleLogoClick() {
    this.router.navigate(['/ldap']);
  }

  protected readonly faChevronLeft = faChevronLeft;
}
