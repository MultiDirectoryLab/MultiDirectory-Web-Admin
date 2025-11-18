import { computed, Directive, Input, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

@Directive({
  selector: '[maxLength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxLengthValidatorDirective,
      multi: true,
    },
  ],
  standalone: true,
})
export class MaxLengthValidatorDirective implements Validator {
  private _maxLength!: number;
  @Input() maxLengthErrorMessage?: string;
  @Input({ required: true })
  set maxLength(value: number) {
    this._maxLength = value;
    this.maxLengthErrorMessage =
      this.maxLengthErrorMessage ??
      translate('error-message.max-length-exceeded', { maxLength: `${this.maxLength}` });
  }

  get maxLength(): number {
    return this._maxLength;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // пропускаем валидацию, если значение пустое (делегируем другим валидаторам)
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // todo: убрать в рамках рефакторинга форм
    const normalizedValue = value instanceof Array ? value[0] : value;

    const exceededMaxLength = this.maxLength ? normalizedValue.length > this.maxLength : false;

    return exceededMaxLength ? { MaxLengthExceeded: this.maxLengthErrorMessage } : null;
  }
}
