import { Directive, input, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[appMinValue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinValueValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class MinValueValidatorDirective implements Validator {
  appMinValue = input<number | undefined>();
  minErrorMessage = input<string>(translate('error-message.value-too-small'));

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // пропускаем валидацию, если значение пустое (делегируем другим валидаторам)
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const minValue = this.appMinValue();
    return minValue !== undefined && value < minValue!
      ? { MinValue: this.minErrorMessage() }
      : null;
  }
}
