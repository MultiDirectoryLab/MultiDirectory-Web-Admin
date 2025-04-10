import { Directive, input } from '@angular/core';
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
  readonly passwordInput = input.required<NgControl>({ alias: 'appPasswordNotMatch' });
  readonly errorLabel = input('');

  validate(control: AbstractControl): ValidationErrors | null {
    const passwordInput = this.passwordInput();
    if ((!passwordInput.touched && !passwordInput.value) || (!control.touched && !control.value)) {
      return null;
    }

    const errorLabel = this.errorLabel();
    return control.value !== passwordInput.value
      ? null
      : {
          PasswordsShouldNotMatch: errorLabel
            ? translate(errorLabel)
            : translate('error-message.passwords-should-not-match'),
        };
  }
}
