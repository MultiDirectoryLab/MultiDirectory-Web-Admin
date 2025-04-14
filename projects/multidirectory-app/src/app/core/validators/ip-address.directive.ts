import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[validIpAddress]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: IpAddressValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class IpAddressValidatorDirective implements Validator {
  readonly errorLabel = input(translate('error-message.ip-valid'));
  ipPattern = new RegExp('^[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+');
  subnetPattern = new RegExp(
    '^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$',
  );
  widePattern = new RegExp(
    '^(((255\.){3})|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$',
  );

  validate(control: AbstractControl): ValidationErrors | null {
    let result = this.ipPattern.test(control.value);
    if (result) {
      return null;
    }
    result = this.subnetPattern.test(control.value);
    if (result) {
      return null;
    }
    return result ? null : { IpAddress: this.errorLabel() };
  }
}
