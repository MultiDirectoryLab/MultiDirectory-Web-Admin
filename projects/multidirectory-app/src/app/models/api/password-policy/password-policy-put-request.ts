import { PasswordPolicy } from '@core/password-policy/password-policy';

export class PasswordPolicyPutRequest {
  group_paths: string[] = [];
  history_length: number = 0;
  id: number = 0;
  max_age_days: number = 0;
  min_age_days: number = 0;
  min_length: number = 0;
  name: string = '';
  password_must_meet_complexity_requirements: boolean = true;
  priority: number = 0;

  constructor(obj: PasswordPolicy) {
    this.group_paths = obj.scopes;
    this.history_length = obj.historyLength;
    this.id = obj.id;
    this.max_age_days = obj.maxAgeDays;
    this.min_age_days = obj.minAgeDays;
    this.min_length = obj.minLength;
    this.name = obj.name;
    this.password_must_meet_complexity_requirements = obj.passwordMustMeetComplexityRequirements;
    this.priority = obj.priority;
  }
}
