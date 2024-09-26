import { Component, OnInit } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-dns-settings',
  templateUrl: './dns-settings.component.html',
  styleUrls: ['./dns-settings.component.scss'],
})
export class DnsSettingsComponent implements OnInit {
  rules: DnsRule[] = [];

  constructor(
    private dnsService: DnsApiService,
    private windows: AppWindowsService,
    private dns: DnsApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.dnsService
      .get()
      .pipe(take(1))
      .subscribe((rules) => {
        const all = rules.flatMap((x) =>
          x.records.map((y) => {
            const rule = new DnsRule(y);
            rule.record_type = x.record_type as DnsRuleType;
            rule.ttl = String(y.ttl);
            rule.hostname = y.hostname.replace(/\.?example\.com/g, '');
            return rule;
          }),
        );
        this.rules = all;
      });
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
          return this.dns.delete(this.rules[toDeleteIndex]);
        }),
      )
      .subscribe((result) => {
        this.rules = this.rules.filter((x, ind) => ind !== toDeleteIndex);
        window.location.reload();
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
        window.location.reload();
      });
  }

  onEdit(index: number) {
    this.windows
      .openDnsRuleDialog(this.rules[index])
      .pipe(
        take(1),
        switchMap((x) => (x ? this.dns.update(x) : EMPTY)),
      )
      .subscribe((rule) => {
        this.toastr.success(translate('dns-settings.success'));
        window.location.reload();
      });
  }
}
