import { ChangeDetectorRef, Component, inject, Input, input, output, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent } from '@mflab/mui-kit';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { ToastrService } from 'ngx-toastr';
import { DnsRuleListItemComponent } from '../dns-rule-list-item/dns-rule-list-item.component';

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
  readonly deleteClick = output<DnsZoneListResponse>();
  readonly turnOffClick = output<DnsZoneListResponse>();
  readonly editClick = output<DnsZoneListResponse>();
  readonly addZoneClick = output<any>();
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

  onDeleteClick() {
    if (!this._dnsZone) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.deleteClick.emit(this.zone!);
  }

  onTurnOffClick() {
    if (!this.zone) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.turnOffClick.emit(this.zone);
    this.cdr.detectChanges();
  }

  onEditClick() {
    if (!this.zone) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.editClick.emit(this.zone);
    this.cdr.detectChanges();
  }

  getType(type: DnsRuleType) {
    return DnsRuleType[type];
  }

  toggleExpand() {
    this.expanded.set(!this.expanded());
  }
}
