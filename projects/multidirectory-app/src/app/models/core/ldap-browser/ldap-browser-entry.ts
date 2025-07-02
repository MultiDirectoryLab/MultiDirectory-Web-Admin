import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';
import { LdapEntryType } from '../ldap/ldap-entry-type';

export class LdapBrowserEntry {
  id: string = '';
  dn: string = '';
  icon: string = '';
  name: string = '';
  type: LdapEntryType = LdapEntryType.None;
  description: string = '';
  expandable: boolean = false;
  attributes: LdapAttribute[] = [];
  constructor(obj: Partial<LdapBrowserEntry>) {
    Object.assign(this, obj);
  }
}
