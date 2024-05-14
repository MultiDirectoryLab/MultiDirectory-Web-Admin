import { LdapOperation } from '@models/entry/update-request';
import { PartialAttribute } from './ldap-attributes/ldap-partial-attribute';

export class ChangeDescription {
  operation: LdapOperation | null = null;
  attribute: PartialAttribute | null = null;
  constructor(obj: Partial<ChangeDescription>) {
    Object.assign(this, obj);
  }
}
