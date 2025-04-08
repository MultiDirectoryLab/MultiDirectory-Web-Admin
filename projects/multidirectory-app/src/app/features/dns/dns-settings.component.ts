import { Component, OnDestroy, OnInit } from '@angular/core';
import { DnsRuleListItemComponent } from '@features/dns/dns-rule-list-item/dns-rule-list-item.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/dns/dns-status-response';
import { DnsStatuses } from '@models/dns/dns-statuses';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { AlertComponent, ButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-settings',
  templateUrl: './dns-settings.component.html',
  styleUrls: ['./dns-settings.component.scss'],
  imports: [
    TranslocoPipe,
    ButtonComponent,
    DnsRuleListItemComponent,
    AlertComponent,
    FaIconComponent,
  ],
})
export class DnsSettingsComponent implements OnInit, OnDestroy {
  dnsStatuses = DnsStatuses;
  dnsStatus = new DnsStatusResponse({});
  rules: DnsRule[] = [];
  faCircleExclamation = faCircleExclamation;
  private unsubscribe = new Subject<boolean>();

  constructor(
    private dnsService: DnsApiService,
    private windows: AppWindowsService,
    private dns: DnsApiService,
    private toastr: ToastrService,
    private app: AppSettingsService,
  ) {}

  ngOnInit(): void {
    this.windows.showSpinner();
    this.app.dnsStatusRx
      .pipe(
        takeUntil(this.unsubscribe),
        catchError((err) => {
          this.windows.hideSpinner();
          throw err;
        }),
      )
      .subscribe((status) => {
        this.windows.hideSpinner();
        this.dnsStatus = status;
        if (this.dnsStatus.dns_status !== DnsStatuses.NOT_CONFIGURED) {
          this.reloadData();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  onDelete(toDeleteIndex: number) {
    const prompt: ConfirmDialogDescriptor = {
      promptHeader: translate('remove-confirmation-dialog.prompt-header'),
      promptText: translate('remove-confirmation-dialog.prompt-text'),
      primaryButtons: [{ id: 'yes', text: translate('remove-confirmation-dialog.yes') }],
      secondaryButtons: [{ id: 'cancel', text: translate('remove-confirmation-dialog.cancel') }],
    };

    this.windows
      .openConfirmDialog(prompt)
      .pipe(take(1))
      .pipe(
        switchMap((x) => {
          if (x === 'cancel' || !x) {
            return EMPTY;
          }
          const rule = this.enusreHostname(this.rules[toDeleteIndex]);
          return this.dns.delete(rule);
        }),
      )
      .subscribe((result) => {
        this.rules = this.rules.filter((x, ind) => ind !== toDeleteIndex);
      });
  }

  onAdd() {
    this.windows
      .openDnsRuleDialog(new DnsRule({}))
      .pipe(
        take(1),
        switchMap((x) => (x ? this.dns.post(x) : EMPTY)),
      )
      .subscribe((rule) => {
        this.toastr.success(translate('dns-settings.success'));
        this.reloadData();
      });
  }

  onEdit(index: number) {
    const rule = this.enusreHostname(this.rules[index]);
    const oldHostname = this.rules[index].record_name;
    this.windows
      .openDnsRuleDialog(rule, true)
      .pipe(
        take(1),
        switchMap((x) => {
          if (!x) return EMPTY;
          this.rules[index] = rule;
          return this.dns.update(rule);
        }),
      )
      .subscribe((rule) => {
        this.rules[index].record_name = oldHostname;
        this.toastr.success(translate('dns-settings.success'));
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
      .subscribe((request) => {
        window.location.reload();
      });
  }

  private reloadData() {
    this.windows.showSpinner();
    this.dnsService
      .get()
      .pipe(
        take(1),
        catchError((err) => {
          this.windows.hideSpinner();
          throw err;
        }),
      )
      .subscribe((rules) => {
        const all = rules.flatMap((x) =>
          x.records.map((y) => {
            const rule = new DnsRule(y);
            rule.record_type = x.record_type as DnsRuleType;
            rule.ttl = y.ttl;
            return rule;
          }),
        );
        this.rules = all;
        this.windows.hideSpinner();
      });
  }

  private enusreHostname(rule: DnsRule): DnsRule {
    const result = new DnsRule(rule);
    result.record_name = result.record_name.replace('.' + this.dnsStatus.zone_name, '');
    return result;
  }
}
