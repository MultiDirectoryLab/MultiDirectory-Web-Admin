import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { translate } from '@jsverse/transloco';
import { ValidationFunctions } from './validator-functions';

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
  readonly passwordPolicy = input.required<PasswordPolicy>();
  readonly errorLabel = input('');

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.touched && control.value) {
      const password = control.value;

      const upperCaseCountOk = ValidationFunctions.upperCaseLettersCount(password) >= this.passwordPolicy().minUppercaseLettersCount;
      const lowerCaseCountOk = ValidationFunctions.loverCaseLettersCount(password) >= this.passwordPolicy().minLowercaseLettersCount;
      const numbersCountOk = ValidationFunctions.digitsCount(password) >= this.passwordPolicy().minDigitsCount;
      const specialSymbolsCountOk = ValidationFunctions.specialSymbolsCount(password) >= this.passwordPolicy().minSpecialSymbolsCount;
      const uniqueSymbolsCountOk = ValidationFunctions.uniqueSymbolsCount(password) >= this.passwordPolicy().minUniqueSymbolsCount;
      const repeatingSymbolsCountOk =
        ValidationFunctions.repeatingSymbolsInRowCount(password) <= this.passwordPolicy().maxRepeatingSymbolsInRowCount;
      const endsWithSixDigitsOk = !ValidationFunctions.endsWithSixDigits(password);

      const languageOk =
        this.passwordPolicy().language === 'Cyrillic'
          ? ValidationFunctions.hasCyrillic(password) && !ValidationFunctions.hasLatin(password)
          : ValidationFunctions.hasLatin(password) && !ValidationFunctions.hasCyrillic(password);

      const passwordValid =
        upperCaseCountOk &&
        lowerCaseCountOk &&
        numbersCountOk &&
        specialSymbolsCountOk &&
        uniqueSymbolsCountOk &&
        repeatingSymbolsCountOk &&
        endsWithSixDigitsOk &&
        languageOk;

      if (!passwordValid) {
        return { PasswordValidator: translate('password-conditions.password-must-meet-conditions') };
      }
    }

    return null;
  }
}
