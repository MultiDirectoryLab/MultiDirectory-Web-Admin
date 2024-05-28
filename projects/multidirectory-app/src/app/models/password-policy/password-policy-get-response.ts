export class PasswordPolicyGetResponse {
  'name': string;
  'password_history_length': number;
  'maximum_password_age_days': number;
  'minimum_password_age_days': number;
  'minimum_password_length': number;
  'password_must_meet_complexity_requirements': boolean;
}
