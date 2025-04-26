import { ChangeDetectorRef, Component, inject, Input, input, output } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsRuleType } from '@models/api/dns/dns-rule-type';
import { PlaneButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dns-rule-list-item',
  templateUrl: './dns-rule-list-item.component.html',
  styleUrls: ['./dns-rule-list-item.component.scss'],
  imports: [PlaneButtonComponent],
})
export class DnsRuleListItemComponent {
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  readonly index = input(0);
  readonly deleteClick = output<DnsRule>();
  readonly turnOffClick = output<DnsRule>();
  readonly editClick = output<DnsRule>();

  _dnsRule: DnsRule | null = null;

  get dnsRule(): DnsRule | null {
    return this._dnsRule;
  }

  @Input() set dnsRule(dnsRule: DnsRule | null) {
    this._dnsRule = dnsRule;
  }

  onDeleteClick() {
    if (!this.dnsRule) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.deleteClick.emit(this.dnsRule);
  }

  onTurnOffClick() {
    if (!this.dnsRule) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.turnOffClick.emit(this.dnsRule);
    this.cdr.detectChanges();
  }

  onEditClick() {
    if (!this.dnsRule) {
      this.toastr.error(translate('dns-rule.client-does-not-exist'));
      return;
    }
    this.editClick.emit(this.dnsRule);
    this.cdr.detectChanges();
  }

  getType(type: DnsRuleType) {
    return DnsRuleType[type];
  }
}
