import { PasswordPolicy } from "../../core/password-policy/password-policy";

export class PasswordPolicyPutRequest {
    "name": string;
    "password_history_length": number;
    "maximum_password_age_days": number;
    "minimum_password_age_days": number;
    "minimum_password_length": number;
    "password_must_meet_complexity_requirements": boolean;

    constructor(obj: PasswordPolicy) {
        this.name = obj.name;
        this.password_history_length = obj.enforcePasswordHistory;
        this.maximum_password_age_days = obj.maximumPasswordAge;
        this.minimum_password_age_days = obj.minimumPasswordAge;
        this.minimum_password_length = obj.minimumPasswordLength;
        this.password_must_meet_complexity_requirements = obj.passwordMustMeetComplexityRequirements;
    }
}