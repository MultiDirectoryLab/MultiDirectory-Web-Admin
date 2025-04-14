export class UserSession {
  id = 0;
  session_id = '';
  ip = '';
  issued = '';
  protocol: string | 'ldap' | 'http' = '';
  sign = '';

  constructor(obj: Partial<UserSession>) {
    Object.assign(this, obj);
  }
}
