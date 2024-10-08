import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NgControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { translate } from '@jsverse/transloco';
export function passwordMatchValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}
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
  @Input('appPasswordMatch') passwordInput!: NgControl;
  @Input() passwordMatchErrorLabel = '';

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.passwordInput.touched || !control.touched) {
      return null;
    }
    return control.value == this.passwordInput.value
      ? null
      : {
          PasswordsDoNotMatch: this.passwordMatchErrorLabel
            ? translate(this.passwordMatchErrorLabel)
            : translate('error-message.passwords-not-match'),
        };
  }
}
