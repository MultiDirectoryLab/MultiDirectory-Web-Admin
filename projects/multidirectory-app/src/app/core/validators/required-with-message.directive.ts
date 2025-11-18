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
    const normalizedValue = control.value instanceof Array ? control.value[0] : control.value;
    return normalizedValue !== null && normalizedValue !== undefined && normalizedValue !== ''
      ? null
      : {
        required: appRequiredErrorLabel
          ? appRequiredErrorLabel
          : translate('error-message.required'),
      };
  }
}
