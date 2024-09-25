import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DropdownOption, MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsRuleType } from '@models/dns/dns-rule-type';

@Component({
  selector: 'app-dns-rule-dialog',
  templateUrl: './dns-rule-dialog.component.html',
  styleUrls: ['./dns-rule-dialog.component.scss'],
})
export class DnsRulesDialogComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: true }) form!: MdFormComponent;
  private _unsubscribe = new Subject<void>();
  formValid = false;
  dnsRule: DnsRule = new DnsRule({});
  DnsRuleTypes = Object.keys(DnsRuleType).map(
    (x, index) =>
      new DropdownOption({
        title: x,
        value: x,
      }),
  );

  _sameAsZoneName = false;
  get sameAsZoneName(): boolean {
    return this._sameAsZoneName;
  }
  set sameAsZoneName(val: boolean) {
    this._sameAsZoneName = val;
    if (val) {
      this.dnsRule.hostname = '@';
    }
    this.cdr.detectChanges();
  }

  constructor(
    @Inject(ModalInjectDirective) private modalInejctor: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntil(this._unsubscribe)).subscribe((x) => {
      this.formValid = x;
    });
    this.dnsRule = this.modalInejctor.contentOptions?.dnsRule ?? new DnsRule({});
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
