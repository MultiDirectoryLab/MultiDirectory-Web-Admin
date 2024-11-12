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
export function passwordNotMatchValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = !nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}
@Directive({
  selector: '[appPasswordNotMatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordNotMatchValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordNotMatchValidatorDirective implements Validator {
  @Input('appPasswordNotMatch') passwordInput!: NgControl;
  @Input() errorLabel = '';

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.passwordInput.touched || !control.touched) {
      return null;
    }
    return control.value !== this.passwordInput.value
      ? translate(this.errorLabel)
      : translate('error-message.passwords-should-not-match');
  }
}
