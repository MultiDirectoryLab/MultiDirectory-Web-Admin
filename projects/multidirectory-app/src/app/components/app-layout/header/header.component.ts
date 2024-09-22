import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { translate } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { ViewMode } from '@features/ldap-browser/components/catalog-content/view-modes';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { ContentViewService } from '@services/content-view.service';
import { MenuService } from '@services/menu.service';
import { MdSlideshiftComponent } from 'multidirectory-ui-kit';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  @Output() helpMenuClick = new EventEmitter<MouseEvent>();
  @Output() accountSettingsClicked = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

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
  constructor(
    private app: AppSettingsService,
    private contentViewService: ContentViewService,
    private hotkeysService: HotkeysService,
    private ldapWindows: AppWindowsService,
    private menu: MenuService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.hotkeysService.add(
      new Hotkey(
        'ctrl+h',
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
        (event: KeyboardEvent): boolean => {
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
    this.logoutClick.next();
  }

  toggleNotificationPanel() {
    this.app.notificationVisible = true;
  }
}
