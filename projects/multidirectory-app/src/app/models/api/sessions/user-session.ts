export class UserSession {
  id: number = 0;
  session_id: string = '';
  ip: string = '';
  issued: string = '';
  protocol: string | 'ldap' | 'http' = '';
  sign: string = '';

  constructor(obj: Partial<UserSession>) {
    Object.assign(this, obj);
  }
}
