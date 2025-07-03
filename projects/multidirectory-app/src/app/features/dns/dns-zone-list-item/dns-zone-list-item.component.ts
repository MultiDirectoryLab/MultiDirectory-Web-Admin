import { ChangeDetectorRef, Component, inject, Input, input, output, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent } from '@mflab/mui-kit';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { ToastrService } from 'ngx-toastr';
import { DnsRuleListItemComponent } from '../dns-rule-list-item/dns-rule-list-item.component';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { DnsZoneDetailsComponent } from '../dns-zone-details/dns-zone-details.component';
import { DnsZoneDetailsDialogData } from '../dns-zone-details/dns-zone-details-dialog-data';
import { take } from 'rxjs';
import { DnsRule } from '@models/api/dns/dns-rule';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-dns-zone-list-item',
  templateUrl: './dns-zone-list-item.component.html',
  styleUrls: ['./dns-zone-list-item.component.scss'],
  imports: [MultidirectoryUiKitModule, TranslocoModule, FaIconComponent],
})
export class DnsZoneListItemComponent {
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(DialogService);

  readonly index = input(0);
  readonly deleteRuleClick = output<DnsRule>();
  readonly turnOffRuleClick = output<DnsRule>();
  readonly editRuleClick = output<DnsRule>();
  readonly addZoneClick = output<any>();
  readonly deleteZoneClick = output<DnsZoneListResponse>();

  readonly faCaretDown = faCaretDown;
  readonly faCaretUp = faCaretUp;

  readonly expanded = signal(false);

  _dnsZone: DnsZoneListResponse | null = null;

  get zone(): DnsZoneListResponse | null {
    return this._dnsZone;
  }

  @Input() set zone(dnsRule: DnsZoneListResponse | null) {
    this._dnsZone = dnsRule;
  }

  addZoneRecord() {
    this.addZoneClick.emit(null);
  }

  onDeleteZoneClick(record: DnsZoneListResponse) {
    this.deleteZoneClick.emit(record);
  }

  toggleExpand(record: DnsZoneListResponse) {
    this.dialog
      .open<any, DnsZoneDetailsDialogData, DnsZoneDetailsComponent>({
        component: DnsZoneDetailsComponent,
        dialogConfig: { data: { zoneName: record.name } },
      })
      .closed.pipe(take(1))
      .subscribe((x) => {});
  }
}
