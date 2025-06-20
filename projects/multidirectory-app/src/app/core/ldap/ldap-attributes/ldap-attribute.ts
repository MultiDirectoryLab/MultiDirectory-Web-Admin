export class LdapAttribute {
  type: string = '';
  vals: string[] = [];

  constructor(obj: Partial<LdapAttribute>) {
    Object.assign(this, obj);
  }
}
