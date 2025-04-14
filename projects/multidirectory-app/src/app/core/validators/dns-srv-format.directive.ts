import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[appDnsSrvFormat]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DnsSrvValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class DnsSrvValidatorDirective implements Validator {
  @Input() srvErrorMessage = translate('error-message.dns-srv-format-valid');
  srvPattern = '^d+\\s+\\d+\\s+\\d+\\s+[a-zA-Z0-9.-]+\\.$';

  validate(control: AbstractControl): ValidationErrors | null {
    const result = new RegExp(this.srvPattern, 'ig').test(control.value);
    return result ? null : { DnsSrvFormat: this.srvErrorMessage };
  }
}
