import { Component, OnInit } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/dns/dns-rule';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
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
    private api: MultidirectoryApiService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.dnsService
      .getDnsRules()
      .pipe(take(1))
      .subscribe((rules) => {
        this.rules = rules;
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
      .subscribe((x) => {
        if (x === 'cancel' || !x) {
          return;
        }
        this.rules = this.rules.filter((x, ind) => ind !== toDeleteIndex);
      });
  }

  onAdd() {
    this.windows
      .openDnsRuleDialog(new DnsRule({}))
      .pipe(take(1))
      .subscribe((rule) => {
        this.rules.push(rule);
      });
  }

  onEdit(index: number) {
    this.windows
      .openDnsRuleDialog(this.rules[index])
      .pipe(take(1))
      .subscribe((rule) => {});
  }
}
