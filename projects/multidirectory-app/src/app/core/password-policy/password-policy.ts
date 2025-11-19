export class PasswordPolicy {
  id: number = 0;
  name = '';
  language: 'Cyrillic' | 'Latin' = 'Latin';
  isExactMatch = true;
  historyLength = 4;
  minAgeDays = 0;
  maxAgeDays = 0;
  minLength = 0;
  maxLength = 0;
  minLowercaseLettersCount = 0;
  minUppercaseLettersCount = 0;
  minLettersCount = 0;
  minSpecialSymbolsCount = 0;
  minDigitsCount = 0;
  minUniqueSymbolsCount = 0;
  maxRepeating_symbols_in_row_count = 0;
  maxSequentialKeyboardSymbolsCount = 0;
  maxSequentialAlphabetSymbolsCount = 0;
  maxFailedAttempts = 0;
  failedAttemptsResetSec = 0;
  lockoutDurationSec = 0;
  failDelaySec = 60;
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
