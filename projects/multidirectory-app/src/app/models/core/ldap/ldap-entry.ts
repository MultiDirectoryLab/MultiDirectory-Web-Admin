import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { LdapEntryType } from './ldap-entry-type';

export class LdapEntry {
  dn: string = '';
  objectClasses: string[] = [];
  attributes: LdapAttribute[] = [];
  type: LdapEntryType = LdapEntryType.None;

  constructor(obj: Partial<LdapEntry>) {
    Object.assign(this, obj);
  }
}
