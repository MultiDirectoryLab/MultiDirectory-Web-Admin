import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPattern]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PatternWithMessageDirective,
      multi: true,
    },
  ],
})
export class PatternWithMessageDirective implements Validator {
  readonly pattern = input.required<string>({ alias: 'appPattern' });
  readonly patternErrorMessage = input('Check the input format');

  validate(control: AbstractControl): ValidationErrors | null {
    const result = new RegExp(this.pattern()).test(control.value);
    return result ? null : { pattern: this.patternErrorMessage() };
  }
}
