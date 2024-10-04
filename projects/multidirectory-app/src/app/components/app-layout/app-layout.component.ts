import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Subject, catchError, combineLatest, switchMap, take, takeUntil, tap } from 'rxjs';
import { AppSettingsService } from '@services/app-settings.service';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { HotkeysCheatsheetComponent } from 'angular2-hotkeys';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { DnsApiService } from '@services/dns-api.service';

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
        const displayName = LdapEntryLoader.getSingleAttribute(searchEntry, 'name');
        const objectClass = searchEntry.partial_attributes.find(
          (x) => x.type.toLocaleLowerCase() == 'objectclass',
        )!;
        const entry = new LdapEntryNode({
          name: displayName,
          type: EntityInfoResolver.getNodeType(objectClass.vals),
          selectable: true,
          expandable: EntityInfoResolver.isExpandable(objectClass.vals),
          entry: searchEntry,
          id: searchEntry.object_name,
        });
        this.app.userEntry = entry;
        const photo = searchEntry.partial_attributes.find((x) => x.type == 'photoBase64');
        if (!!photo && photo.vals.length > 0) {
          this.app.user.jpegPhoto = photo.vals[0] ?? undefined;
        }
        this.cdr.detectChanges();
      });

    this.dns.status().subscribe((status) => {
      this.app.dnsStatus = status;
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
