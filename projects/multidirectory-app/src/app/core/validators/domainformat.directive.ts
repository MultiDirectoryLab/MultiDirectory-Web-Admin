import { Directive, input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  PatternValidator,
  ValidationErrors,
  Validator,
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
  standalone: true,
})
export class DomainFormatValidatorDirective implements Validator {
  readonly domainPattern = input.required<string>({ alias: 'appDomainFormat' });
  readonly domainErrorMessage = input('Check a domain format');

  patternValidator = new PatternValidator();

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const result = new RegExp(this.domainPattern()).test(control.value);
    return result ? null : { DomainFormat: this.domainErrorMessage() };
  }
}
