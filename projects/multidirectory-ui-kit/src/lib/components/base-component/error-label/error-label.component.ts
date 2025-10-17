import { AfterViewInit, Component, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseControlComponent } from '../control.component';

@Component({
  selector: 'md-error-label',
  templateUrl: './error-label.component.html',
  styleUrls: ['./error-label.component.scss'],
})
export class ErrorLabelComponent extends BaseControlComponent {
  @Input() ngControl!: NgControl;
  constructor() {
    super();
  }

  getFirstError(): string | undefined {
    const errors = this.ngControl?.errors;
    if (!errors) {
      return undefined;
    }
    if (errors['required']) {
      return 'required';
    }
    if (!!errors['pattern']) {
      return 'pattern';
    }
    if (!!errors['PasswordsDoNotMatch']) {
      return errors['PasswordsDoNotMatch'];
    }
    if (!!errors['DomainFormat']) {
      return errors['DomainFormat'];
    }
    if (!!errors['DnsSrvFormat']) {
      return errors['DnsSrvFormat'];
    }
    if (!!errors['IpAddress']) {
      return errors['IpAddress'];
    }
    if (!!errors['MfKeyFormat']) {
      return errors['MfKeyFormat'];
    }
    if (!!errors['PasswordsShouldNotMatch']) {
      return errors['PasswordsShouldNotMatch'];
    }
    if (!!errors['PasswordValidator']) {
      return errors['PasswordValidator'];
    }
    if (!!errors['PasswordValidator']) {
      return errors['PasswordValidator'];
    }
    if (!!errors['MaxLengthExceeded']) {
      return errors['MaxLengthExceeded'];
    }
    if (!!errors['ValueIsForbidden']) {
      return errors['ValueIsForbidden'];
    }
    if (!!errors['MinValue']) {
      return errors['MinValue'];
    }
    if (!!errors['MaxValue']) {
      return errors['MaxValue'];
    }
    return undefined;
  }
}
