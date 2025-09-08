import { ChangeDetectorRef, Component, ElementRef, inject, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ViewMode } from '@features/ldap-browser/components/catalog-content/view-modes';
import { SearchPanelComponent } from '@features/search/search-panel.component';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { ContentViewService } from '@services/content-view.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import {
  DropdownContainerDirective,
  DropdownMenuComponent,
  PlaneButtonComponent,
  RadiobuttonComponent,
  RadioGroupComponent,
  ShiftCheckboxComponent,
} from 'multidirectory-ui-kit';
import { ChangePasswordDialogComponent } from '../../modals/components/dialogs/change-password-dialog/change-password-dialog.component';
import { EntityPropertiesDialogComponent } from '../../modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';
import {
  ChangePasswordDialogData,
  ChangePasswordDialogReturnData,
} from '../../modals/interfaces/change-password-dialog.interface';
import {
  EntityPropertiesDialogData,
  EntityPropertiesDialogReturnData,
} from '../../modals/interfaces/entity-properties-dialog.interface';
import { DialogService } from '../../modals/services/dialog.service';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    PlaneButtonComponent,
    DropdownContainerDirective,
    RadioGroupComponent,
    DropdownMenuComponent,
    ShiftCheckboxComponent,
    RadiobuttonComponent,
    SearchPanelComponent,
    RouterLink,
    FormsModule,
    TranslocoDirective,
    AsyncPipe,
  ],
})
export class HeaderComponent {
  private app = inject(AppSettingsService);
  private contentViewService = inject(ContentViewService);
  private hotkeysService = inject(HotkeysService);
  private router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialogService: DialogService = inject(DialogService);
  readonly helpMenuClick = output<MouseEvent>();
  readonly accountSettingsClicked = output<void>();
  readonly logoutClick = output<void>();
  readonly searchBtn = viewChild('searchBtn', { read: ElementRef });
  $sidebarVisibility = this.app.$sidebarVisibility;
  darkMode = false;
  ViewMode = ViewMode;

  get contentView(): ViewMode {
    return this.contentViewService.contentView;
  }

  set contentView(view: ViewMode) {
    this.contentViewService.contentView = view;
  }

  get user(): WhoamiResponse | undefined {
    return this.app.user;
  }

  constructor() {
    this.hotkeysService.add(
      new Hotkey(
        'esc',
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();
          // this.router.navigate(['/']); TODO: Разобраться для чего
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-small-icon-view'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+shift+f', 'meta+shift+f'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();
          this.searchBtn()?.nativeElement.click();
          return false;
        },
        undefined,
        translate('hotkeys.toggle-search-menu'),
      ),
    );

    this.hotkeysService.add(
      new Hotkey(
        ['ctrl+d', 'meta+d'],
        (event: KeyboardEvent): boolean => {
          event.preventDefault();
          event.stopPropagation();
          this.onDarkMode(!this.darkMode);
          return false;
        },
        undefined,
        translate('hotkeys.toggle-search-menu'),
      ),
    );

    this.darkMode = localStorage.getItem('dark-mode') == 'true';
  }

  onDarkMode(value: boolean) {
    this.darkMode = value;
    this.app.setDarkMode(this.darkMode);
  }

  showHelp() {
    this.hotkeysService.cheatSheetToggle.next(true);
  }

  closeCatalog() {
    this.router.navigate(['/']);
    this.cdr.detectChanges();
  }

  onAccountSettingsClick() {
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
        hasBackdrop: false,
        width: '600px',
        minHeight: '660px',
        data: { entity: this.app.userEntry },
      },
    });
  }

  onChangePasswordClick() {
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

  onLogout() {
    this.logoutClick.emit();
  }
}
