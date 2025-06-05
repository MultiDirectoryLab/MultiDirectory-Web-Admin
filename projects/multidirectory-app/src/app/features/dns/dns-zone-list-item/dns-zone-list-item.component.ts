import { ChangeDetectorRef, Component, inject, Input, input, output, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent } from '@mflab/mui-kit';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { ToastrService } from 'ngx-toastr';
import { DnsRuleListItemComponent } from '../dns-rule-list-item/dns-rule-list-item.component';
import { DnsRule } from '@models/dns/dns-rule';

@Component({
  selector: 'app-dns-zone-list-item',
  templateUrl: './dns-zone-list-item.component.html',
  styleUrls: ['./dns-zone-list-item.component.scss'],
  imports: [MuiButtonComponent, TranslocoModule, FaIconComponent, DnsRuleListItemComponent],
})
export class DnsZoneListItemComponent {
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
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

  onTurnOffRuleClick(record: DnsRule) {
    if (!this.zone) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.turnOffRuleClick.emit(record);
  }

  onEditRuleClick(record: DnsRule) {
    this.editRuleClick.emit(record);
  }

  onDeleteRuleClick(record: DnsRule) {
    this.deleteRuleClick.emit(record);
  }

  onDeleteZoneClick(record: DnsZoneListResponse) {
    this.deleteZoneClick.emit(record);
  }

  toggleExpand() {
    this.expanded.set(!this.expanded());
  }
}
