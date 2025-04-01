import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-dns-rule-list-item',
  templateUrl: './dns-rule-list-item.component.html',
  styleUrls: ['./dns-rule-list-item.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule],
})
export class DnsRuleListItemComponent {
  @Input() index = 0;
  @Output() deleteClick = new EventEmitter<DnsRule>();
  @Output() turnOffClick = new EventEmitter<DnsRule>();
  @Output() editClick = new EventEmitter<DnsRule>();

  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

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
