export class ClearMultifactorRequest {
  scope: 'ldap' | 'http' = 'ldap';

  constructor(obj: Partial<ClearMultifactorRequest>) {
    Object.assign(this, obj);
  }
}
