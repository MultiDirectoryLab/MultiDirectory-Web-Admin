export class PasswordPolicy {
  id?: number;
  name = '';
  // Enforce password history
  // Count of passwords remembered
  enforcePasswordHistory = 0;

  // Maximum password age 90 days
  maximumPasswordAge = 90;

  // Minimum password age 0 days
  minimumPasswordAge = 0;

  // Minimum password length 5 characters
  minimumPasswordLength = 5;

  // Password must meet complexity requirements Disabled
  passwordMustMeetComplexityRequirements = false;
  // Store passwords using reversible encryption Disabled
  useReversibleEncryption = false;

  constructor(obj: Partial<PasswordPolicy> = {}) {
    Object.assign(this, obj);
  }
}
