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
  selector: '[appPasswordMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordMatchValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordMatchValidatorDirective implements Validator {
  readonly passwordInput = input.required<NgControl>({ alias: 'appPasswordMatch' });
  readonly passwordMatchErrorLabel = input('');

  validate(control: AbstractControl): ValidationErrors | null {
    const passwordInput = this.passwordInput();
    if ((!passwordInput.touched && !passwordInput.value) || (!control.touched && !control.value)) {
      return null;
    }

    const passwordMatchErrorLabel = this.passwordMatchErrorLabel();
    return control.value == passwordInput.value
      ? null
      : {
          PasswordsDoNotMatch: passwordMatchErrorLabel
            ? translate(passwordMatchErrorLabel)
            : translate('error-message.passwords-not-match'),
        };
  }
}
