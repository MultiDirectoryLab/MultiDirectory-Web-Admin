import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[appPasswordNotMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordShouldNotMatchValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordShouldNotMatchValidatorDirective implements Validator {
  @Input('appPasswordNotMatch') passwordInput!: NgControl;
  @Input() errorLabel = '';

  validate(control: AbstractControl): ValidationErrors | null {
    if (
      (!this.passwordInput.touched && !this.passwordInput.value) ||
      (!control.touched && !control.value)
    ) {
      return null;
    }

    return control.value !== this.passwordInput.value
      ? null
      : {
          PasswordsShouldNotMatch: this.errorLabel
            ? translate(this.errorLabel)
            : translate('error-message.passwords-should-not-match'),
        };
  }
}
