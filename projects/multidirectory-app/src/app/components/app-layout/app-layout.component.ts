import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { SearchQueries } from '@core/ldap/search';
import { translate } from '@jsverse/transloco';
import { DnsStatusResponse } from '@models/dns/dns-status-response';
import { DnsStatuses } from '@models/dns/dns-statuses';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AppSettingsService } from '@services/app-settings.service';
import { DnsApiService } from '@services/dns-api.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { HotkeysCheatsheetComponent } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subject, catchError, of, switchMap, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('helpcheatSheet') helpcheatSheet!: HotkeysCheatsheetComponent;
  showLeftPane = true;
  showNotifications = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private app: AppSettingsService,
    private toastr: ToastrService,
    private api: MultidirectoryApiService,
    private dns: DnsApiService,
    private cdr: ChangeDetectorRef,
  ) {}

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
        catchError((x) => {
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
        const entry = new LdapEntryNode({
          name: displayName,
          type: EntityInfoResolver.getNodeType(objectClass.vals),
          selectable: true,
          expandable: EntityInfoResolver.isExpandable(objectClass.vals),
          //  entry: searchEntry,
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
        catchError((err) => {
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
    this.helpcheatSheet.toggleCheatSheet();
  }

  onNotificationsHide() {
    this.app.notificationVisible = false;
  }
}
