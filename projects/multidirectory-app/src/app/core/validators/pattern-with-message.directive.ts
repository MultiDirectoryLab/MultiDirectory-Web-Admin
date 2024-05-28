import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  PatternValidator,
  RequiredValidator,
  ValidationErrors,
  Validator,
  ValidatorFn,
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
export class PatternWithMessageDirective extends PatternValidator {
  @Input('errorLabel') errorLabel = 'This value is invalid';

  override validate(control: AbstractControl): ValidationErrors | null {
    const result = super.validate(control);
    return !result ? null : { required: this.errorLabel };
  }
}
