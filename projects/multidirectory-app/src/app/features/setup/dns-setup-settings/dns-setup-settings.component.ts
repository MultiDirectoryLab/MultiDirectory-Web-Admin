import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { DnsSetupComponent } from '@features/forms/dns-setup/dns-setup/dns-setup.component';
import { SetupRequest } from '@models/api/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-setup-settings',
  templateUrl: './dns-setup-settings.component.html',
  styleUrls: ['./dns-setup-settings.component.scss'],
})
export class DnsSetupSettingsComponent implements AfterViewInit, OnDestroy {
  @Input() setupRequest!: SetupRequest;
  unsubscribe = new Subject<void>();
  @ViewChild('form') form!: DnsSetupComponent;

  constructor(private setupRequestValidatorService: SetupRequestValidatorService) {}

  ngAfterViewInit(): void {
    this.setupRequestValidatorService.invalidateRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.form.validate();
      });
  }

  private _formValid = false;
  set formValid(valid: boolean) {
    this._formValid = valid;
    this.setupRequestValidatorService.stepValid(valid);
  }
  get formValid() {
    return this._formValid;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
