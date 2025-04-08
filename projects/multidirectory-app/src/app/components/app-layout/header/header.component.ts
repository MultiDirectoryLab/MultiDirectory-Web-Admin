import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ViewMode } from '@features/ldap-browser/components/catalog-content/view-modes';
import { SearchPanelComponent } from '@features/search/search-panel.component';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { ContentViewService } from '@services/content-view.service';
import { MenuService } from '@services/menu.service';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import {
  DropdownContainerDirective,
  DropdownMenuComponent,
  MdSlideshiftComponent,
  PlaneButtonComponent,
  RadiobuttonComponent,
  RadioGroupComponent,
  ShiftCheckboxComponent,
} from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
  ],
})
export class HeaderComponent implements OnDestroy {
  private app = inject(AppSettingsService);
  private contentViewService = inject(ContentViewService);
  private hotkeysService = inject(HotkeysService);
  private ldapWindows = inject(AppWindowsService);
  private menu = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  readonly helpMenuClick = output<MouseEvent>();
  readonly accountSettingsClicked = output<void>();
  readonly logoutClick = output<void>();

  @ViewChild('searchBtn', { read: ElementRef }) searchBtn?: ElementRef;
  @ViewChild('notifications', { read: MdSlideshiftComponent }) slideshift!: MdSlideshiftComponent;
  showNotifications = false;
  unsubscribe = new Subject<boolean>();
  navigationalPanelInvisible = false;
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

  // TODO: TOO MUCH SERVICES
  constructor() {
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+h',
        (): boolean => {
          this.onChange(!this.navigationalPanelInvisible);
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-navbar'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'esc',
        (): boolean => {
          this.router.navigate(['/']);
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-small-icon-view'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'f1',
        (): boolean => {
          this.contentView = ViewMode.SmallIcons;
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-small-icon-view'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'f2',
        (): boolean => {
          this.contentView = ViewMode.BigIcons;
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-big-icon-view'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'f3',
        (): boolean => {
          this.contentView = ViewMode.Table;
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-list-view'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'f4',
        (): boolean => {
          this.contentView = ViewMode.Details;
          return false; // Prevent bubbling
        },
        undefined,
        translate('hotkeys.toggle-detail-view'),
      ),
    );
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+f',
        (): boolean => {
          this.searchBtn?.nativeElement.click();
          return false;
        },
        undefined,
        translate('hotkeys.toggle-search-menu'),
      ),
    );

    this.hotkeysService.add(
      new Hotkey(
        'ctrl+d',
        (): boolean => {
          this.onDarkMode(!this.darkMode);
          return false;
        },
        undefined,
        translate('hotkeys.toggle-search-menu'),
      ),
    );

    this.darkMode = localStorage.getItem('dark-mode') == 'true';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  onChange(value: boolean) {
    this.navigationalPanelInvisible = value;
    this.app.setNavigationalPanelVisiblity(!this.navigationalPanelInvisible);
    window.dispatchEvent(new Event('resize'));
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

  openAccessControl() {
    this.menu.showAccessControlMenu();
  }

  onAccountSettingsClick() {
    if (!this.app.userEntry) {
      return;
    }
    this.ldapWindows.openEntityProperiesModal(this.app.userEntry);
  }

  onChangePasswordClick() {
    if (!this.app.userEntry) {
      return;
    }
    this.ldapWindows.openChangePasswordModal(this.app.userEntry);
  }

  onLogout() {
    this.logoutClick.emit();
  }

  toggleNotificationPanel() {
    this.app.notificationVisible = true;
  }
}
