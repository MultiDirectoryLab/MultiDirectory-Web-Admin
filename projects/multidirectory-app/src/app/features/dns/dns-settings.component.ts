import { Component, OnInit, inject, DestroyRef } from '@angular/core';
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
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { DialogService } from '../../components/modals/services/dialog.service';
import { ConfirmDialogComponent } from '../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../components/modals/interfaces/confirm-dialog.interface';
import { DnsRuleDialogComponent } from '../../components/modals/components/dialogs/dns-rule-dialog/dns-rule-dialog.component';
import {
  DnsRuleDialogData,
  DnsRuleDialogReturnData,
} from '../../components/modals/interfaces/dns-rule-dialog.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class DnsSettingsComponent implements OnInit {
  public dnsStatuses = DnsStatuses;
  public dnsStatus = new DnsStatusResponse({});
  public rules: DnsRule[] = [];
  public faCircleExclamation = faCircleExclamation;

  private dialogService: DialogService = inject(DialogService);
  private dnsService: DnsApiService = inject(DnsApiService);
  private windows: AppWindowsService = inject(AppWindowsService);
  private dns: DnsApiService = inject(DnsApiService);
  private toastr: ToastrService = inject(ToastrService);
  private app: AppSettingsService = inject(AppSettingsService);
  private destroyRef$: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.windows.showSpinner();
    this.app.dnsStatusRx
      .pipe(
        takeUntilDestroyed(this.destroyRef$),
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

  public onDelete(toDeleteIndex: number) {
    const prompt: ConfirmDialogDescriptor = {
      promptHeader: translate('remove-confirmation-dialog.prompt-header'),
      promptText: translate('remove-confirmation-dialog.prompt-text'),
      primaryButtons: [{ id: 'yes', text: translate('remove-confirmation-dialog.yes') }],
      secondaryButtons: [{ id: 'cancel', text: translate('remove-confirmation-dialog.cancel') }],
    };

    this.dialogService
      .open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
        component: ConfirmDialogComponent,
        dialogConfig: {
          minHeight: '160px',
          data: prompt,
        },
      })
      .closed.pipe(
        take(1),
        switchMap((x) => {
          if (x === 'cancel' || !x) {
            return EMPTY;
          }
          const rule = this.enusreHostname(this.rules[toDeleteIndex]);
          return this.dns.delete(rule);
        }),
      )
      .subscribe(() => {
        this.rules = this.rules.filter((_, ind) => ind !== toDeleteIndex);
      });
  }

  public onAdd() {
    this.dialogService
      .open<DnsRuleDialogReturnData, DnsRuleDialogData, DnsRuleDialogComponent>({
        component: DnsRuleDialogComponent,
        dialogConfig: {
          minHeight: '360px',
          data: { rule: new DnsRule({}) },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((x) => (x ? this.dns.post(x) : EMPTY)),
      )
      .subscribe(() => {
        this.toastr.success(translate('dns-settings.success'));
        this.reloadData();
      });
  }

  public onEdit(index: number) {
    const rule = this.enusreHostname(this.rules[index]);
    const oldHostname = this.rules[index].record_name;

    this.dialogService
      .open<DnsRuleDialogReturnData, DnsRuleDialogData, DnsRuleDialogComponent>({
        component: DnsRuleDialogComponent,
        dialogConfig: {
          minHeight: '360px',
          data: { rule, isEdit: true },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((x) => {
          if (!x) return EMPTY;
          this.rules[index] = rule;
          return this.dns.update(rule);
        }),
      )
      .subscribe(() => {
        this.rules[index].record_name = oldHostname;
        this.toastr.success(translate('dns-settings.success'));
      });
  }

  public handleSetupClick() {
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
        this.rules = rules.flatMap((x) =>
          x.records.map((y) => {
            const rule = new DnsRule(y);
            rule.record_type = x.record_type as DnsRuleType;
            rule.ttl = y.ttl;
            return rule;
          }),
        );
        this.windows.hideSpinner();
      });
  }

  private enusreHostname(rule: DnsRule): DnsRule {
    const result = new DnsRule(rule);
    result.record_name = result.record_name.replace('.' + this.dnsStatus.zone_name, '');
    return result;
  }
}
