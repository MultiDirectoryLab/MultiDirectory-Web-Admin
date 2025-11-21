export class PasswordPolicy {
  id: number = 0;
  name = '';
  language: 'Cyrillic' | 'Latin' = 'Latin';
  isExactMatch = true;
  historyLength = 4;
  minAgeDays = 0;
  maxAgeDays = 0;
  minLength = 7;
  maxLength = 32;
  minLowercaseLettersCount = 0;
  minUppercaseLettersCount = 0;
  minLettersCount = 0;
  minSpecialSymbolsCount = 0;
  minDigitsCount = 0;
  minUniqueSymbolsCount = 0;
  maxRepeatingSymbolsInRowCount = 0;
  maxSequentialKeyboardSymbolsCount = 0;
  maxSequentialAlphabetSymbolsCount = 0;
  maxFailedAttempts = 6;
  failedAttemptsResetSec = 60;
  lockoutDurationSec = 600;
  failDelaySec = 5;
  priority = 1;
  scopes: string[] = [];

  constructor(obj: Partial<PasswordPolicy> = {}) {
    Object.assign(this, obj);
  }

  get prettyScopes(): string[] {
    return this.scopes.map((scope) => {
      const equalIndex = scope.indexOf('=');

      if (equalIndex === -1) {
        return scope;
      }

      const commaIndex = scope.indexOf(',', equalIndex);

      if (commaIndex === -1) {
        return scope.substring(equalIndex + 1);
      }

      return scope.substring(equalIndex + 1, commaIndex);
    });
  }
}
