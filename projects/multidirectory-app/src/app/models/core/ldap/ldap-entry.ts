import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

export class LdapEntry {
  dn: string = '';
  objectClasses: string[] = [];
  attributes: LdapAttribute[] = [];

  constructor(obj: Partial<LdapEntry>) {
    Object.assign(this, obj);
  }
}
