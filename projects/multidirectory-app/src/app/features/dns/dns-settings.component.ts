import { Component, OnDestroy, OnInit } from '@angular/core';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/dns/dns-status-response';
import { DnsStatuses } from '@models/dns/dns-statuses';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, of, Subject, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-settings',
  templateUrl: './dns-settings.component.html',
  styleUrls: ['./dns-settings.component.scss'],
})
export class DnsSettingsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<boolean>();
  dnsStatuses = DnsStatuses;
  dnsStatus = new DnsStatusResponse({});
  rules: DnsRule[] = [];
  faCircleExclamation = faCircleExclamation;

  constructor(
    private dnsService: DnsApiService,
    private windows: AppWindowsService,
    private dns: DnsApiService,
    private toastr: ToastrService,
    private app: AppSettingsService,
  ) {}

  ngOnInit(): void {
    this.app.dnsStatusRx.pipe(takeUntil(this.unsubscribe)).subscribe((status) => {
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

  private reloadData() {
    this.dnsService
      .get()
      .pipe(take(1))
      .subscribe((rules) => {
        const all = rules.flatMap((x) =>
          x.records.map((y) => {
            const rule = new DnsRule(y);
            rule.record_type = x.record_type as DnsRuleType;
            rule.ttl = String(y.ttl);
            return rule;
          }),
        );
        this.rules = all;
      });
  }

  private enusreHostname(rule: DnsRule): DnsRule {
    const result = new DnsRule(rule);
    result.hostname = result.hostname.replace('.' + this.dnsStatus.zone_name, '');
    return result;
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
    const oldHostname = this.rules[index].hostname;
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
        this.rules[index].hostname = oldHostname;
        this.toastr.success(translate('dns-settings.success'));
      });
  }

  handleSetupClick() {
    this.windows
      .openDnsSetupDialog(new DnsSetupRequest(this.dnsStatus as any))
      .pipe(
        take(1),
        switchMap((request) => {
          return this.dns.setup(request);
        }),
      )
      .subscribe((request) => {
        console.log(request);
      });
  }
}
