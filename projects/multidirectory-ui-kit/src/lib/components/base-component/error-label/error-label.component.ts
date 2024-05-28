import { AfterViewInit, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'md-error-label',
  templateUrl: './error-label.component.html',
  styleUrls: ['./error-label.component.scss'],
})
export class ErrorLabelComponent {
  @Input() ngControl!: NgControl;
  constructor() {}

  getFirstError(): string | undefined {
    if (!!this.ngControl?.errors?.['required']) {
      return this.ngControl?.errors?.['required'];
    }
    if (!!this.ngControl?.errors?.['pattern']) {
      return this.ngControl?.errors?.['pattern'];
    }
    if (!!this.ngControl?.errors?.['PasswordsDoNotMatch']) {
      return this.ngControl?.errors?.['PasswordsDoNotMatch'];
    }
    if (!!this.ngControl?.errors?.['DomainFormat']) {
      return this.ngControl?.errors?.['DomainFormat'];
    }
    if (!!this.ngControl?.errors?.['IpAddress']) {
      return this.ngControl?.errors?.['IpAddress'];
    }
    if (!!this.ngControl?.errors?.['MfKeyFormat']) {
      return this.ngControl?.errors?.['MfKeyFormat'];
    }
    return undefined;
  }
}
