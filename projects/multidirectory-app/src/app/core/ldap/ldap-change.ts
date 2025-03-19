import { LdapOperation } from '@models/api/entry/update-request';
import { LdapAttribute } from './ldap-attributes/ldap-attribute';

export class ChangeDescription {
  operation: LdapOperation = LdapOperation.None;
  attribute: LdapAttribute = new LdapAttribute({});

  constructor(obj: Partial<ChangeDescription>) {
    Object.assign(this, obj);
  }
}
