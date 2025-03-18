export class SetupMultifactorRequest {
  mfa_key = '';
  mfa_secret = '';
  is_ldap_scope = false;
  constructor(obj: Partial<SetupMultifactorRequest>) {
    Object.assign(this, obj);
  }
}
