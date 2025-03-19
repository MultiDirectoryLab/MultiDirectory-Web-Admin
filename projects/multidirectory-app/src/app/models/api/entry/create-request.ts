import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

export class CreateEntryRequest {
  entry = '';
  attributes: PartialAttribute[] = [];
  password?: string;

  constructor(obj: Partial<CreateEntryRequest>) {
    Object.assign(this, obj);
  }
}
