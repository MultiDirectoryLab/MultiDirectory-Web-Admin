import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/dns/dns-status-response';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { DnsApiService } from '@services/dns-api.service';
import { MdFormComponent } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-setup',
  templateUrl: './dns-setup.component.html',
  styleUrls: ['./dns-setup.component.scss'],
})
export class DnsSetupComponent implements AfterViewInit, OnDestroy {
  @Input() formValid = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  @Input() dnsSetupRequest: DnsSetupRequest = new DnsSetupRequest({});
  @Output() dnsSetupRequestChange = new EventEmitter<DnsSetupRequest>();

  @ViewChild('form') form!: MdFormComponent;

  useExternalService = false;

  private unsubscribe = new Subject<boolean>();

  constructor() {}

  ngAfterViewInit(): void {
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
