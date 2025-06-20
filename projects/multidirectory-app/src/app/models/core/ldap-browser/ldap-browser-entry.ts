export class LdapBrowserEntry {
  dn: string = '';
  icon: string = '';
  name: string = '';
  type: string = '';
  description: string = '';
  expandable: boolean = false;

  constructor(obj: Partial<LdapBrowserEntry>) {
    Object.assign(this, obj);
  }
}
