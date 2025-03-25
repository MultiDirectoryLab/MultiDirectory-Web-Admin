export class LdapBrowserEntry {
  dn: string = '';
  icon: string = '';
  name: string = '';
  type: string = '';
  description: string = '';

  constructor(obj: Partial<LdapBrowserEntry>) {
    Object.assign(this, obj);
  }
}
