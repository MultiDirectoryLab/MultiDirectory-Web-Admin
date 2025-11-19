export class PasswordPolicyGetResponse {
  id = 1;
  'name': string;
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
}
