import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[appMaxValue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxValueValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class MaxValueValidatorDirective implements Validator {
  @Input() appMaxValue?: number;
  @Input() maxErrorMessage = translate('error-message.value-too-big');

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // пропускаем валидацию, если значение пустое (делегируем другим валидаторам)
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const num = Number(value);
    if (isNaN(num)) {
      return { MinValue: translate('error-message.value-nan') };
    }

    return !!this.appMaxValue && num > this.appMaxValue ? { MaxValue: this.maxErrorMessage } : null;
  }
}
