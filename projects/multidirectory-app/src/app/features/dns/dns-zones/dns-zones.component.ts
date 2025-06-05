import { Component, inject, OnInit } from '@angular/core';
import { MuiButtonComponent } from '@mflab/mui-kit';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { DnsApiService } from '@services/dns-api.service';
import { DnsZoneListItemComponent } from '../dns-zone-list-item/dns-zone-list-item.component';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { AddZoneDialogComponent } from '../add-zone-dialog/add-zone-dialog.component';
import { DnsRule } from '@models/dns/dns-rule';
import { rule } from 'postcss';
import { DnsRuleDialogComponent } from '../dns-rule-dialog/dns-rule-dialog.component';
import {
  DnsRuleDialogData,
  DnsRuleDialogReturnData,
} from '../../../components/modals/interfaces/dns-rule-dialog.interface';
import { EMPTY, switchMap, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dns-zones',
  templateUrl: './dns-zones.component.html',
  styleUrls: ['./dns-zones.component.scss'],
  imports: [MuiButtonComponent, TranslocoModule, DnsZoneListItemComponent],
})
export default class DnsZonesComponent implements OnInit {
  private dns = inject(DnsApiService);
  private dialogService = inject(DialogService);
  private toastr = inject(ToastrService);
  zones: DnsZoneListResponse[] = [];

  listDnsZones(name: string = '') {}

  ngOnInit(): void {
    const name = '';
    this.dns.zone(name).subscribe((x) => {
      console.log(x);
      this.zones = x;
    });
  }

  addZoneClick(zone: DnsZoneListResponse) {
    this.dialogService
      .open<DnsRuleDialogComponent, object, object>({
        component: DnsRuleDialogComponent,
        dialogConfig: {
          data: {},
        },
      })
      .closed.pipe()
      .subscribe((result: any) => {
        if (!result) {
          return;
        }
        console.log(result);
      });
  }

  onEditRuleClick(rule: DnsRule) {
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
          return this.dns.update(rule);
        }),
      )
      .subscribe(() => {
        this.toastr.success(translate('dns-settings.success'));
      });
  }

  onDeleteRuleClick(rule: DnsRule) {}

  onTurnOffRuleClick(rule: DnsRule) {
    console.log(rule);
  }

  onDeleteZoneClick() {
    alert('test');
    console.log('det');
  }

  onAddDnsZone() {
    this.dialogService
      .open<AddZoneDialogComponent, object, object>({
        component: AddZoneDialogComponent,
        dialogConfig: {
          data: {},
        },
      })
      .closed.pipe()
      .subscribe((result: any) => {
        if (!result) {
          return;
        }
        console.log(result);
      });
  }
}
