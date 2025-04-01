import { Directive, input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  RequiredValidator,
  ValidationErrors,
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
  standalone: true,
})
export class RequiredWithMessageDirective extends RequiredValidator {
  readonly appRequiredErrorLabel = input('');

  override validate(control: AbstractControl): ValidationErrors | null {
    const appRequiredErrorLabel = this.appRequiredErrorLabel();
    return control.value !== null && control.value !== undefined && control.value !== ''
      ? null
      : {
          required: appRequiredErrorLabel
            ? appRequiredErrorLabel
            : translate('error-message.required'),
        };
  }
}
