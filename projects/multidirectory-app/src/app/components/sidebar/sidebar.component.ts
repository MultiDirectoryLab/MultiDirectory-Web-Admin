import { Component, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DropdownContainerDirective, DropdownMenuComponent } from 'multidirectory-ui-kit';
import { Subject, take } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [TranslocoDirective, RouterOutlet, DropdownContainerDirective, DropdownMenuComponent],
})
export class SidebarComponent implements OnDestroy {
  private unsubscribe = new Subject<void>();

  constructor(
    private app: AppSettingsService,
    private router: Router,
    private windows: AppWindowsService,
  ) {}

  get user(): WhoamiResponse {
    return this.app.user;
  }

  logout() {
    this.app
      .logout()
      .pipe(take(1))
      .subscribe((x) => {
        this.router.navigate(['login']);
      });
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

  handleLogoClick(event: MouseEvent) {
    this.router.navigate(['/ldap']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
