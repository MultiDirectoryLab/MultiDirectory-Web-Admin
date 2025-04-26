import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

export enum LdapOperation {
  None = -1,
  Add = 0,
  Delete = 1,
  Replace = 2,
}
export class LdapChange {
  operation = 0;
  modification: LdapAttribute = new LdapAttribute({});

  constructor(obj: Partial<LdapChange>) {
    Object.assign(this, obj);
  }
}

export class UpdateEntryRequest {
  object = '';
  changes: LdapChange[] = [];

  constructor(obj: Partial<UpdateEntryRequest>) {
    Object.assign(this, obj);
  }
}
