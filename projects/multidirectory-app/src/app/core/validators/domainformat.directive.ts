import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  PatternValidator,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
@Directive({
  selector: '[appDomainFormat]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DomainFormatValidatorDirective,
      multi: true,
    },
  ],
})
export class DomainFormatValidatorDirective implements Validator {
  @Input('appDomainFormat') domainPattern!: string;
  @Input() domainErrorMessage = 'Check a domain format';

  patternValidator = new PatternValidator();
  validate(control: AbstractControl): ValidationErrors | null {
    const result = new RegExp(this.domainPattern).test(control.value);
    return result ? null : { DomainFormat: this.domainErrorMessage };
  }
}
