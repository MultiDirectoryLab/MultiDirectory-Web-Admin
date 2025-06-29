import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MuiButtonComponent, MuiTabDirective, MuiTabsComponent } from '@mflab/mui-kit';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { AlertComponent } from '../../../../../multidirectory-ui-kit/src/lib/components/alert/alert.component';
import { ConfirmDialogComponent } from '../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../components/modals/interfaces/confirm-dialog.interface';
import { DialogService } from '../../components/modals/services/dialog.service';
import DnsZonesComponent from './dns-zones/dns-zones.component';
import { ConfirmDialogDescriptor } from '@models/api/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsRuleType } from '@models/api/dns/dns-rule-type';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsStatuses } from '@models/api/dns/dns-statuses';

@Component({
  selector: 'app-dns-settings',
  templateUrl: './dns-settings.component.html',
  styleUrls: ['./dns-settings.component.scss'],
  imports: [
    TranslocoPipe,
    MuiTabsComponent,
    MuiButtonComponent,
    FontAwesomeModule,
    MuiTabDirective,
    DnsZonesComponent,
    AlertComponent,
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
            rule.type = x.type as DnsRuleType;
            rule.ttl = y.ttl;
            return rule;
          }),
        );
        this.windows.hideSpinner();
      });
  }

  private enusreHostname(rule: DnsRule): DnsRule {
    const result = new DnsRule(rule);
    result.name = result.name.replace('.' + this.dnsStatus.zone_name, '');
    return result;
  }
}
