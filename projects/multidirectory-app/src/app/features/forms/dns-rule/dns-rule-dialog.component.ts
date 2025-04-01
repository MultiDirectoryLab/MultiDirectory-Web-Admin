import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IpAddressValidatorDirective } from '@core/validators/ip-address.directive';
import { Ip6AddressValidatorDirective } from '@core/validators/ip6-address.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { DnsRule } from '@models/dns/dns-rule';
import {
  AvailableDnsRecordTypes,
  DnsRuleClass,
  DnsRuleType,
  DnsTypeToDataType,
} from '@models/dns/dns-rule-type';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownComponent,
  MdFormComponent,
  ModalInjectDirective,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-rule-dialog',
  templateUrl: './dns-rule-dialog.component.html',
  styleUrls: ['./dns-rule-dialog.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    CheckboxComponent,
    Ip6AddressValidatorDirective,
    IpAddressValidatorDirective,
    DropdownComponent,
    ButtonComponent,
  ],
})
export class DnsRulesDialogComponent implements OnInit, OnDestroy {
  private modalInejctor = inject<ModalInjectDirective>(ModalInjectDirective);
  private cdr = inject(ChangeDetectorRef);
  private _unsubscribe = new Subject<void>();
  readonly form = viewChild.required<MdFormComponent>('form');
  formValid = false;
  editMode = false;
  dnsRule: DnsRule = new DnsRule({});
  DnsRuleTypes = AvailableDnsRecordTypes;
  DnsRuleClass = DnsRuleClass;
  recordDataType: number = -1;

  _sameAsZoneName = false;

  get sameAsZoneName(): boolean {
    return this._sameAsZoneName;
  }

  set sameAsZoneName(val: boolean) {
    this._sameAsZoneName = val;
    if (val) {
      this.dnsRule.record_name = '@';
    }
    this.cdr.detectChanges();
  }

  get recordType() {
    return this.dnsRule.record_type;
  }

  set recordType(type: DnsRuleType) {
    this.dnsRule.record_type = type;
    this.recordDataType = DnsTypeToDataType.get(type)?.valueOf() ?? -1;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.formValid = this.form().valid;
    this.form()
      .onValidChanges.pipe(takeUntil(this._unsubscribe))
      .subscribe((x) => {
        this.formValid = x;
      });
    this.dnsRule = this.modalInejctor.contentOptions?.dnsRule ?? new DnsRule({});
    this.editMode = this.modalInejctor.contentOptions?.editMode ?? false;

    this.recordType = this.dnsRule.record_type;
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.modalInejctor.close(this.dnsRule);
  }

  onClose() {
    this.modalInejctor.close(null);
  }
}
