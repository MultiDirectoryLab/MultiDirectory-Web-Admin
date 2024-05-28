import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { AppSettingsService } from '@services/app-settings.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { AppWindowsService } from '@services/app-windows.service';
import { TokenStorageHelper } from '@core/authorization/token-storage-helper';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
  private unsubscribe = new Subject<void>();

  get user(): WhoamiResponse {
    return this.app.user;
  }

  constructor(
    private app: AppSettingsService,
    private router: Router,
    private windows: AppWindowsService,
  ) {}

  logout() {
    TokenStorageHelper.clear();
    this.app.user = new WhoamiResponse({});
    this.router.navigate(['/login']);
  }

  openAccountSettings() {
    if (!this.app.userEntry) {
      return;
    }
    this.windows.openEntityProperiesModal(this.app.userEntry);
  }

  openChangePassword() {
    if (!this.app.userEntry) {
      return;
    }
    this.windows.openChangePasswordModal(this.app.userEntry);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
