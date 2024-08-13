import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NgControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
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
  @Input() errorLabel = 'Passwords should not match';

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.passwordInput.touched || !control.touched) {
      return null;
    }
    return control.value !== this.passwordInput.value
      ? null
      : { PasswordShouldNotMatch: this.errorLabel };
  }
}
