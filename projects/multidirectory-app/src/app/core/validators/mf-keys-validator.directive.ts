import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  PatternValidator,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
@Directive({
  selector: '[appMfKeyValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MfKeyValidatorDirective,
      multi: true,
    },
  ],
})
export class MfKeyValidatorDirective implements Validator {
  keyErrorLabel = 'MF Key should be 32 charecters long and start with "rs_"';
  secretErrorLabel = 'MF Secret should be 32 charecters long';

  @Input() isSecret = false;
  keyFormat = /^rs_(?:[A-Za-z0-9]{29})$/gi;
  secretFormat = /^(?:[A-Za-z0-9]{32})$/gi;

  validate(control: AbstractControl): ValidationErrors | null {
    const format = new RegExp(this.isSecret ? this.secretFormat : this.keyFormat);

    return format.test(control.value)
      ? null
      : {
          MfKeyFormat: this.isSecret ? this.secretErrorLabel : this.keyErrorLabel,
        };
  }
}
