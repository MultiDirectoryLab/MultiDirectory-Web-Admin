import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  PatternValidator,
  ValidationErrors,
  Validator,
} from '@angular/forms';
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
  @Input('appPattern') pattern!: string;
  @Input() patternErrorMessage = 'Check the input format';

  validate(control: AbstractControl): ValidationErrors | null {
    const result = new RegExp(this.pattern).test(control.value);
    return result ? null : { pattern: this.patternErrorMessage };
  }
}
