import { PasswordPolicy } from '@core/password-policy/password-policy';

export class PasswordPolicyPutRequest {
  name: string;
  language: 'Cyrillic' | 'Latin' = 'Latin';
  is_exact_match = true;
  history_length = 4;
  min_age_days = 0;
  max_age_days = 0;
  min_length = 7;
  max_length = 32;
  min_lowercase_letters_count = 0;
  min_uppercase_letters_count = 0;
  min_letters_count = 0;
  min_special_symbols_count = 0;
  min_digits_count = 0;
  min_unique_symbols_count = 0;
  max_repeating_symbols_in_row_count = 0;
  max_sequential_keyboard_symbols_count = 0;
  max_sequential_alphabet_symbols_count = 0;
  max_failed_attempts = 0;
  failed_attempts_reset_sec = 60;
  lockout_duration_sec = 600;
  fail_delay_sec = 5;
  priority = 1;
  group_paths: string[] = [];

  constructor(obj: PasswordPolicy) {
    this.name = obj.name;
    this.language = obj.language;
    this.is_exact_match = obj.isExactMatch;
    this.history_length = obj.historyLength;
    this.min_age_days = obj.minAgeDays;
    this.max_age_days = obj.maxAgeDays;
    this.min_length = obj.minLength;
    this.max_length = obj.maxLength;
    this.min_lowercase_letters_count = obj.minLowercaseLettersCount;
    this.min_uppercase_letters_count = obj.minUppercaseLettersCount;
    this.min_letters_count = obj.minLettersCount;
    this.min_special_symbols_count = obj.minSpecialSymbolsCount;
    this.min_digits_count = obj.minDigitsCount;
    this.min_unique_symbols_count = obj.minUniqueSymbolsCount;
    this.max_repeating_symbols_in_row_count = obj.maxRepeating_symbols_in_row_count;
    this.max_sequential_keyboard_symbols_count = obj.maxSequentialKeyboardSymbolsCount;
    this.max_sequential_alphabet_symbols_count = obj.maxSequentialAlphabetSymbolsCount;
    this.max_failed_attempts = obj.maxFailedAttempts;
    this.failed_attempts_reset_sec = obj.failedAttemptsResetSec;
    this.lockout_duration_sec = obj.lockoutDurationSec;
    this.fail_delay_sec = obj.failDelaySec;
    this.priority = obj.priority;
    this.group_paths = obj.scopes;
  }
}
