import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

  static loverCaseLettersCount(value: string) {
    const lowercaseRegex = /[a-z]/g;
    const matches = value.match(lowercaseRegex);
    return matches ? matches.length : 0;
  }

  static upperCaseLettersCount(value: string) {
    const uppercaseRegex = /[A-Z]/g;
    const matches = value.match(uppercaseRegex);
    return matches ? matches.length : 0;
  }

  static digitsCount(value: string) {
    const digitsRegex = /\d/g;
    const matches = value.match(digitsRegex);
    return matches ? matches.length : 0;
  }

  static specialSymbolsCount(value: string) {
    const specialSymbolsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    const matches = value.match(specialSymbolsRegex);
    return matches ? matches.length : 0;
  }

  static uniqueSymbolsCount(value: string) {
    const uniqueSymbolsRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    const matches = value.match(uniqueSymbolsRegex);
    return matches ? matches.length : 0;
  }

  static repeatingSymbolsInRowCount(value: string) {
    const repeatingSymbolsRegex = /(.)\1+/g;
    const matches = value.match(repeatingSymbolsRegex);
    matches?.sort((a, b) => b.length - a.length);
    return matches && matches.length > 0 ? matches[0].length : 0;
  }

  static endsWithSixDigits(value: string): boolean {
    if (!value || value.length < 6) {
      return false;
    }
    const lastSixDigitsRegex = /\d{6}$/;
    return lastSixDigitsRegex.test(value);
  }

  static hasCyrillic(value: string): boolean {
    const cyrillicRegex = /[а-яёА-ЯЁ]/;
    return cyrillicRegex.test(value);
  }

  static hasLatin(value: string): boolean {
    const latinRegex = /[a-zA-Z]/;
    return latinRegex.test(value);
  }
}
