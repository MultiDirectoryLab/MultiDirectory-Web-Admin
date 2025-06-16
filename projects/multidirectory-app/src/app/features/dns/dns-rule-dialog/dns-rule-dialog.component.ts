import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ip6AddressValidatorDirective } from '@core/validators/ip6-address.directive';
import { IpAddressValidatorDirective } from '@core/validators/ip-address.directive';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { DnsRule } from '@models/dns/dns-rule';
import {
  AvailableDnsRecordTypes,
  DnsRuleClass,
  DnsRuleType,
  DnsTypeToDataType,
} from '@models/dns/dns-rule-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../components/modals/services/dialog.service';
import {
  DnsRuleDialogData,
  DnsRuleDialogReturnData,
} from '../../../components/modals/interfaces/dns-rule-dialog.interface';
import { DialogComponent } from '../../../components/modals/components/core/dialog/dialog.component';

@Component({
  selector: 'app-dns-rule-dialog',
  standalone: true,
  imports: [
    Ip6AddressValidatorDirective,
    IpAddressValidatorDirective,
    MultidirectoryUiKitModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    FormsModule,
    DialogComponent,
  ],
  templateUrl: './dns-rule-dialog.component.html',
  styleUrl: './dns-rule-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnsRuleDialogComponent implements OnInit {
  public dialogData: DnsRuleDialogData = inject(DIALOG_DATA);

  @ViewChild('form', { static: true }) form!: MdFormComponent;
  public formValid = false;
  public dnsRule: DnsRule = new DnsRule({});
  public DnsRuleTypes = AvailableDnsRecordTypes;
  public DnsRuleClass = DnsRuleClass;
  public recordDataType = -1;

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef$: DestroyRef = inject(DestroyRef);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<DnsRuleDialogReturnData, DnsRuleDialogComponent> = inject(DialogRef);

  private _sameAsZoneName = false;

  public get sameAsZoneName(): boolean {
    return this._sameAsZoneName;
  }

  public set sameAsZoneName(val: boolean) {
    this._sameAsZoneName = val;
    if (val) {
      this.dnsRule.record_name = '@';
    }
    this.cdr.detectChanges();
  }

  public get recordType() {
    return this.dnsRule.record_type;
  }

  public set recordType(type: DnsRuleType) {
    this.dnsRule.record_type = type;
    this.recordDataType = DnsTypeToDataType.get(type)?.valueOf() ?? -1;
    this.cdr.detectChanges();
  }

  public ngOnInit() {
    this.formValid = this.form.valid;
    this.form.onValidChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((x) => {
      this.formValid = x;
    });
    this.dnsRule = this.dialogData.rule ?? {};
    this.recordType = this.dnsRule.record_type;
  }

  onFinish(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.dialogService.close(this.dialogRef, this.dnsRule);
  }

  onClose() {
    this.dialogService.close(this.dialogRef, null);
  }
}
