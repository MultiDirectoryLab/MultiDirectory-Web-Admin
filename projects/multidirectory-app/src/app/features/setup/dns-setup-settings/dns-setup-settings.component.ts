import { AfterViewInit, Component, inject, Input, OnDestroy, viewChild } from '@angular/core';
import { DnsSetupComponent } from '@features/forms/dns-setup/dns-setup/dns-setup.component';
import { SetupRequest } from '@models/setup/setup-request';
import { SetupRequestValidatorService } from '@services/setup-request-validator.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dns-setup-settings',
  templateUrl: './dns-setup-settings.component.html',
  styleUrls: ['./dns-setup-settings.component.scss'],
  imports: [DnsSetupComponent],
})
export class DnsSetupSettingsComponent implements AfterViewInit, OnDestroy {
  private setupRequestValidatorService = inject(SetupRequestValidatorService);

  @Input() setupRequest!: SetupRequest;
  unsubscribe = new Subject<void>();
  readonly form = viewChild.required<DnsSetupComponent>('form');

  private _formValid = false;

  get formValid() {
    return this._formValid;
  }

  set formValid(valid: boolean) {
    this._formValid = valid;
    this.setupRequestValidatorService.stepValid(valid);
  }

  ngAfterViewInit(): void {
    this.setupRequestValidatorService.invalidateRx
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.form().validate();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
