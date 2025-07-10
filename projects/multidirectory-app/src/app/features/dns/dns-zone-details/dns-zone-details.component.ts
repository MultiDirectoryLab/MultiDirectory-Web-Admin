import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { DnsApiService } from '@services/dns-api.service';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter,
  lastValueFrom,
  map,
  pipe,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { DnsRuleListItemComponent } from '../dns-rule-list-item/dns-rule-list-item.component';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../../../components/modals/components/core/dialog/dialog.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DnsZoneDetailsDialogData } from './dns-zone-details-dialog-data';
import { MuiButtonComponent, MuiInputComponent } from '@mflab/mui-kit';
import { DialogService } from '../../../components/modals/services/dialog.service';
import {
  DnsRuleDialogReturnData,
  DnsRuleDialogData,
} from '../../../components/modals/interfaces/dns-rule-dialog.interface';
import { DnsRuleDialogComponent } from '../dns-rule-dialog/dns-rule-dialog.component';
import { FormsModule } from '@angular/forms';
import { DnsRule } from '@models/api/dns/dns-rule';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-dns-zone-details',
  templateUrl: './dns-zone-details.component.html',
  styleUrls: ['./dns-zone-details.component.scss'],
  imports: [
    DnsRuleListItemComponent,
    DialogComponent,
    MultidirectoryUiKitModule,
    FormsModule,
    TranslocoModule,
  ],
})
export class DnsZoneDetailsComponent implements AfterViewInit {
  private readonly dialogData: DnsZoneDetailsDialogData = inject(DIALOG_DATA);
  private readonly dialog = inject(DialogService);
  private readonly dns = inject(DnsApiService);
  private readonly toastr = inject(ToastrService);

  readonly deleteRuleClick = output<DnsRule>();
  readonly turnOffRuleClick = output<DnsRule>();
  readonly search = signal('');
  readonly zoneName = signal('');
  readonly reloadRx = new BehaviorSubject(false);

  readonly zone = toSignal(
    combineLatest([
      toObservable(this.zoneName),
      toObservable(this.search),
      this.reloadRx.asObservable(),
    ]).pipe(
      switchMap(() => this.dns.zone()),
      map((zones) => zones.filter((x) => x.name == this.zoneName())?.[0] ?? {}),
      tap((zones) =>
        zones.records.filter((x) => {
          x.records = x.records.filter((y) => y?.name?.includes(this.search()));
          return x;
        }),
      ),
    ),
    { initialValue: new DnsZoneListResponse({}) },
  );

  ngAfterViewInit(): void {
    this.zoneName.set(this.dialogData.zoneName);
  }

  onTurnOffRuleClick(record: DnsRule) {
    if (!this.zone) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.turnOffRuleClick.emit(record);
  }

  onEditRuleClick(record: DnsRule) {
    this.dialog
      .open<DnsRuleDialogReturnData, DnsRuleDialogData, DnsRuleDialogComponent>({
        component: DnsRuleDialogComponent,
        dialogConfig: {
          minHeight: '512px',
          data: { rule: record },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((x) => (x ? this.dns.update(x) : EMPTY)),
      )
      .subscribe(() => {
        this.reloadRx.next(true);
        this.toastr.success(translate('dns-settings.success'));
      });
  }

  onDeleteRuleClick(record: DnsRule) {
    this.dns.delete(record).subscribe((response) => {
      this.zoneName.set(this.dialogData.zoneName);
    });
  }

  onAdd() {
    this.dialog
      .open<DnsRuleDialogReturnData, DnsRuleDialogData, DnsRuleDialogComponent>({
        component: DnsRuleDialogComponent,
        dialogConfig: {
          minHeight: '512px',
          data: { rule: new DnsRule({ zone_name: this.zoneName() }) },
        },
      })
      .closed.pipe(
        take(1),
        tap((x) => {
          if (!!x && !x.name.endsWith(x.zone_name)) {
            x.name += '.' + x.zone_name;
          }
        }),
        switchMap((x) => (x ? this.dns.post(x) : EMPTY)),
      )
      .subscribe(() => {
        this.reloadRx.next(true);
        this.toastr.success(translate('dns-settings.success'));
      });
  }
}
