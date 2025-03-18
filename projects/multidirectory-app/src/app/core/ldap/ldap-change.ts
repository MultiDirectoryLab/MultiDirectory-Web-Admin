import { LdapOperation } from '@models/api/entry/update-request';
import { PartialAttribute } from './ldap-attributes/ldap-partial-attribute';

export class ChangeDescription {
  operation: LdapOperation = LdapOperation.None;
  attribute: PartialAttribute = new PartialAttribute({});

  constructor(obj: Partial<ChangeDescription>) {
    Object.assign(this, obj);
  }
}
