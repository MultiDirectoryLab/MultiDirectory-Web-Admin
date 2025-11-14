export class PasswordPolicyGetResponse {
  group_paths: string[] = [];
  history_length: number = 0;
  id: number = 0;
  max_age_days: number = 0;
  min_age_days: number = 0;
  min_length: number = 0;
  name: string = '';
  password_must_meet_complexity_requirements: boolean = true;
  priority: number = 0;
}
