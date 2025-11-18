import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidationFunctions {
  static shouldBePhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      return phoneRegex.test(control.value) ? null : { shouldBePhone: true };
    };
  }

  static shouldBeMacAddress(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return this.macAddress(control.value) ? null : { shouldBeMacAddress: true };
  }

  static shouldBeWebpage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
      return urlRegex.test(control.value) ? null : { shouldBeWebpage: true };
    };
  }

  static macAddress(value: string | undefined) {
    if (!value) {
      return false;
    }
    const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macAddressRegex.test(value);
  }
}
