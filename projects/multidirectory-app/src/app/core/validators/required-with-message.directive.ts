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
import { translate } from '@jsverse/transloco';
@Directive({
  selector: '[appRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RequiredWithMessageDirective,
      multi: true,
    },
  ],
})
export class RequiredWithMessageDirective extends RequiredValidator {
  @Input('appDomainFormat') domainPattern!: string;
  @Input() errorLabel = translate('error-message.required');

  override validate(control: AbstractControl): ValidationErrors | null {
    return control.value !== null && control.value !== undefined && control.value !== ''
      ? null
      : { required: this.errorLabel };
  }
}
