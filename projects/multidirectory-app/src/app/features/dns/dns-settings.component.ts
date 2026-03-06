import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MuiTabDirective, MuiTabsComponent } from '@mflab/mui-kit';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, finalize, switchMap, take } from 'rxjs';
import { DialogService } from '@components/modals/services/dialog.service';
import DnsZonesComponent from './dns-zones/dns-zones.component';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsStatuses } from '@models/api/dns/dns-statuses';
import { DnsForwardZonesComponent } from './dns-forward-zones/dns-forward-zones.component';
import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dns-settings',
  templateUrl: './dns-settings.component.html',
  styleUrls: ['./dns-settings.component.scss'],
  imports: [
    TranslocoPipe,
    MuiTabsComponent,
    MultidirectoryUiKitModule,
    FontAwesomeModule,
    FormsModule,
    MuiTabDirective,
    DnsZonesComponent,
    DnsForwardZonesComponent,
  ],
})
export class DnsSettingsComponent implements OnInit {
  onDnsSecChange(event: any) {
    this._dnsSec = event;
    this.dns
      .setServerOptions([{ name: 'dnssec-validation', value: this._dnsSec }])
      .pipe(take(1))
      .subscribe();
  }
  dnsStatuses = DnsStatuses;
  dnsStatus = new DnsStatusResponse({});
  rules: DnsRule[] = [];
  faCircleExclamation = faCircleExclamation;

  private dialogService: DialogService = inject(DialogService);
  private dnsService: DnsApiService = inject(DnsApiService);
  private windows: AppWindowsService = inject(AppWindowsService);
  private dns: DnsApiService = inject(DnsApiService);
  private toastr: ToastrService = inject(ToastrService);
  private app: AppSettingsService = inject(AppSettingsService);
  private destroyRef$: DestroyRef = inject(DestroyRef);

  dnsSecOptions = [
    new DropdownOption({ title: translate('dns-settings.yes'), value: 'yes' }),
    new DropdownOption({ title: translate('dns-settings.no'), value: 'no' }),
    new DropdownOption({ title: translate('dns-settings.auto'), value: 'auto' }),
  ];

  private _dnsSec = 'auto';
  get dnsSec(): string {
    return this._dnsSec;
  }
  set dnsSec(value: string) {
    this._dnsSec = value;
  }

  ngOnInit(): void {
    this.windows.showSpinner();
    this.app.dnsStatusRx
      .pipe(
        takeUntilDestroyed(this.destroyRef$),
        finalize(() => {
          this.windows.hideSpinner();
        }),
      )
      .subscribe((status) => {
        this.dnsStatus = status;
      });

    this.dns
      .getServerOptions()
      .pipe(
        take(1),
        finalize(() => this.windows.hideSpinner()),
      )
      .subscribe((options) => {
        const dnsSecOption = options.find((x) => x.name == 'dnssec-validation');
        this.dnsSec = dnsSecOption?.value ?? 'auto';
      });
  }

  handleSetupClick() {
    this.windows
      .openDnsSetupDialog(new DnsSetupRequest(this.dnsStatus as any))
      .pipe(
        take(1),
        switchMap((request) => {
          if (!request) {
            return EMPTY;
          }
          return this.dns.setup(request);
        }),
      )
      .subscribe(() => {
        window.location.reload();
      });
  }
}
