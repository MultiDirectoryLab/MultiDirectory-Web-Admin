import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';
import { ValidationFunctions } from '@core/validators/validator-functions';

@Directive({
  selector: '[validMacAddress]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MacAddressValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class MacAddressValidatorDirective implements Validator {
  readonly errorLabel = input(translate('error-message.mac-valid'));

  validate(control: AbstractControl): ValidationErrors | null {
    return ValidationFunctions.shouldBeMacAddress(control);
  }
}
