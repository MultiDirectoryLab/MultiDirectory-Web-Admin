import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[validIp]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UniversalIpValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class UniversalIpValidatorDirective implements Validator {
  readonly errorLabel = input(translate('error-message.ip-valid'));
  ipPattern = new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:-(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))?(?:\\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$',
  );

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    
    if (!value) {
      return null;
    }
    // возможно, передан список IP через запятую
    const extractedIps: string[] = value.replace(/\s/g, '').split(',');

    return extractedIps.every((ip) => this.ipPattern.test(ip)) ? null : { IpAddress: this.errorLabel() };
  }
}
