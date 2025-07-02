import { Component, inject, OnInit } from '@angular/core';
import { MuiButtonComponent } from '@mflab/mui-kit';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { DnsApiService } from '@services/dns-api.service';
import { DnsZoneListItemComponent } from '../dns-zone-list-item/dns-zone-list-item.component';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { AddZoneDialogComponent } from '../add-zone-dialog/add-zone-dialog.component';
import { DnsRuleDialogComponent } from '../dns-rule-dialog/dns-rule-dialog.component';
import {
  DnsRuleDialogData,
  DnsRuleDialogReturnData,
} from '../../../components/modals/interfaces/dns-rule-dialog.interface';
import { EMPTY, switchMap, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogReturnData,
  ConfirmDialogData,
} from '../../../components/modals/interfaces/confirm-dialog.interface';
import { ConfirmDialogDescriptor } from '@models/api/confirm-dialog/confirm-dialog-descriptor';
import { DnsRule } from '@models/api/dns/dns-rule';

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

  onDeleteZoneClick(zone: DnsZoneListResponse) {
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
      .closed.pipe(take(1))
      .subscribe((result) => {
        if (result === 'yes') {
          this.dns.deleteZone([zone.name]).subscribe((result) => {
            this.zones = this.zones.filter((x) => x !== zone);
          });
          return;
        }
        return EMPTY;
      });
  }

  onAddDnsZone() {
    this.dialogService
      .open<AddZoneDialogComponent, object, object>({
        component: AddZoneDialogComponent,
        dialogConfig: {
          data: {},
        },
      })
      .closed.pipe(
        switchMap((result) => {
          return this.dns.zone('');
        }),
      )
      .subscribe((result: DnsZoneListResponse[]) => {
        if (!result) {
          return;
        }
        this.zones = result;
      });
  }
}
