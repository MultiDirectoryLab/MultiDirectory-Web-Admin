import { LdapEntryType } from '../ldap/ldap-entry-type';

export class LdapBrowserEntry {
  id: string = '';
  dn: string = '';
  icon: string = '';
  name: string = '';
  type: LdapEntryType = LdapEntryType.None;
  description: string = '';
  expandable: boolean = false;

  constructor(obj: Partial<LdapBrowserEntry>) {
    Object.assign(this, obj);
  }
}
