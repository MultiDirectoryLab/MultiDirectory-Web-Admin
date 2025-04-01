import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[validIp6Address]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: Ip6AddressValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class Ip6AddressValidatorDirective implements Validator {
  @Input() errorLabel = translate('error-message.ip6-valid');
  ipPattern = new RegExp(`^([a-f0-9:]+:+)+[a-f0-9]+$`);

  validate(control: AbstractControl): ValidationErrors | null {
    let result = this.ipPattern.test(control.value);
    if (result) {
      return null;
    }
    return result ? null : { IpAddress: this.errorLabel };
  }
}
