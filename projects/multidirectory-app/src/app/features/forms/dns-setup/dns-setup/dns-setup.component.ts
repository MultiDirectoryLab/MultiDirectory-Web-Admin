import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { DnsStatuses } from '@models/dns/dns-statuses';
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

  @Input() formValid = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  @Input() dnsSetupRequest: DnsSetupRequest = new DnsSetupRequest({});
  @Output() dnsSetupRequestChange = new EventEmitter<DnsSetupRequest>();

  @ViewChild('form') form!: MdFormComponent;
  private unsubscribe = new Subject<boolean>();

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
    this.form.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valid) => {
      this.formValid = valid;
      this.formValidChange.emit(valid);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  validate() {
    this.form.validate();
  }
}
