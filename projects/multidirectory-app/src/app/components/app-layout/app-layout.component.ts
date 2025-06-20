import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { SearchQueries } from '@core/ldap/search';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { HotkeyModule, HotkeysCheatsheetComponent } from 'angular2-hotkeys';
import { MdSlideshiftComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { WindowsComponent } from './shared/windows/windows.component';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsStatuses } from '@models/api/dns/dns-statuses';
import { KerberosStatuses } from '@models/api/kerberos/kerberos-status';
import { AppSettingsService } from '@services/app-settings.service';
import { DnsApiService } from '@services/dns-api.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  imports: [
    NgClass,
    SidebarComponent,
    HeaderComponent,
    RouterOutlet,
    MdSlideshiftComponent,
    NotificationsComponent,
    HotkeyModule,
    TranslocoPipe,
    WindowsComponent,
  ],
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private app = inject(AppSettingsService);
  private toastr = inject(ToastrService);
  private api = inject(MultidirectoryApiService);
  private dns = inject(DnsApiService);
  private cdr = inject(ChangeDetectorRef);
  private unsubscribe = new Subject<void>();
  readonly helpcheatSheet = viewChild.required<HotkeysCheatsheetComponent>('helpcheatSheet');
  showLeftPane = true;
  showNotifications = false;

  ngOnInit() {
    this.app.navigationalPanelVisibleRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.showLeftPane = x;
    });

    this.app.notificationVisibleRx.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.showNotifications = x;
    });

    this.api
      .getKerberosStatus()
      .pipe(
        take(1),
        catchError(() => {
          this.app.kerberosStatus = KerberosStatuses.ERROR;
          return EMPTY;
        }),
      )
      .subscribe((kerberosStatus) => (this.app.kerberosStatus = kerberosStatus));

    this.app.userRx
      .pipe(
        takeUntil(this.unsubscribe),
        tap((user) => {
          this.app.user = user;
        }),
        switchMap((user) => {
          return this.api.search(SearchQueries.getProperites(user.dn));
        }),
      )
      .subscribe((userSearch) => {
        const searchEntry = userSearch.search_result[0];
        const displayName = 'test'; //LdapEntryLoader.getSingleAttribute(searchEntry, 'name');
        const objectClass = searchEntry.partial_attributes.find(
          (x) => x.type.toLocaleLowerCase() == 'objectclass',
        )!;
        const entry = new NavigationNode({
          name: displayName,
          selectable: true,
          expandable: EntityInfoResolver.isExpandable(objectClass.vals),
          id: searchEntry.object_name,
        });
        this.app.userEntry = entry;
        const photo = searchEntry.partial_attributes.find((x) => x.type == 'photoBase64');
        if (!!photo && photo.vals.length > 0) {
          this.app.user.jpegPhoto = photo.vals[0] ?? undefined;
        }
        this.cdr.detectChanges();
      });

    this.dns
      .status()
      .pipe(
        catchError(() => {
          this.toastr.error(translate('dns-settings.dns-unavailable'));
          return of(
            new DnsStatusResponse({
              dns_status: DnsStatuses.NOT_CONFIGURED,
            }),
          );
        }),
      )
      .subscribe((status) => {
        this.app.dnsStatus = status;
      });

    this.api.getPasswordPolicy().subscribe((x) => {
      this.app.validatePasswords = x.passwordMustMeetComplexityRequirements;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  closeCheatsheet() {
    this.helpcheatSheet().toggleCheatSheet();
  }

  onNotificationsHide() {
    this.app.notificationVisible = false;
  }
}
