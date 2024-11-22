import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { translate } from '@jsverse/transloco';

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
  keyErrorLabel = translate('error-message.mf-key-format-error');
  secretErrorLabel = translate('error-message.mf-secret-format-error');

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
