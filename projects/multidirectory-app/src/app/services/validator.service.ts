import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AttributeListEntry } from '@components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  shouldBePhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      return phoneRegex.test(control.value) ? null : { shouldBePhone: true };
    };
  }

  shouldBeWebpage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
      return urlRegex.test(control.value) ? null : { shouldBeWebpage: true };
    };
  }

  shouldBeUnique(tree: AttributeListEntry[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (tree.map((x) => x.name).includes(control.value)) {
        return { notUnique: true };
      }
      return null;
    };
  }
}
