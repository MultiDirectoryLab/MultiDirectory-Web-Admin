import { Directive, inject, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';

@Directive({
  selector: '[appPasswordShouldBeValid]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  private app = inject(AppSettingsService);
  readonly errorLabel = input('');

  validate(control: AbstractControl): ValidationErrors | null {
    if ((!control.touched && !control.value) || !this.app.validatePasswords) {
      return null;
    }
    const password = control.value;
    var hasUpperCase = /[A-ZА-Я]/.test(password);
    var hasLowerCase = /[a-zа-я]/.test(password);
    var hasNumbers = /\d/.test(password);
    var endsWith6Digits = /.*\d{6,}$/.test(password);
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || endsWith6Digits) {
      return { PasswordValidator: translate('password-conditions.password-must-meet-conditions') };
    }
    return null;
  }
}
