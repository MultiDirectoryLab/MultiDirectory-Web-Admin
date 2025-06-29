import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatuses } from '@models/api/dns/dns-statuses';
import {
  CheckboxComponent,
  MdFormComponent,
  NumberComponent,
  TextareaComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-setup',
  templateUrl: './dns-setup.component.html',
  styleUrls: ['./dns-setup.component.scss'],
  imports: [
    TranslocoPipe,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    CheckboxComponent,
    TextareaComponent,
    NumberComponent,
  ],
})
export class DnsSetupComponent implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private unsubscribe = new Subject<boolean>();
  @Input() formValid = false;
  readonly formValidChange = output<boolean>();
  @Input() dnsSetupRequest: DnsSetupRequest = new DnsSetupRequest({});
  readonly dnsSetupRequestChange = output<DnsSetupRequest>();
  readonly form = viewChild.required<MdFormComponent>('form');

  private _useExternalService = false;

  get useExternalService(): boolean {
    return this._useExternalService;
  }

  set useExternalService(value: boolean) {
    this._useExternalService = value;
    this.dnsSetupRequest.dns_status = value ? DnsStatuses.HOSTED : DnsStatuses.SELFHOSTED;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.dnsSetupRequest.dns_status = this._useExternalService
      ? DnsStatuses.HOSTED
      : DnsStatuses.SELFHOSTED;
    this.form()
      .onValidChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((valid) => {
        this.formValid = valid;
        this.formValidChange.emit(valid);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  validate() {
    this.form().validate();
  }
}
