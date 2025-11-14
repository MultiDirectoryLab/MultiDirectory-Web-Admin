export class PasswordPolicy {
  scopes: string[] = [];
  historyLength: number = 0;
  id: number = 0;
  maxAgeDays: number = 0;
  minAgeDays: number = 0;
  minLength: number = 0;
  name: string = '';
  passwordMustMeetComplexityRequirements: boolean = true;
  priority: number = 0;

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
