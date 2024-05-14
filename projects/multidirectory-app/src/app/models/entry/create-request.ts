import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

export class CreateEntryRequest {
  entry: string = '';
  attributes: PartialAttribute[] = [];
  password: string = '';

  constructor(obj: Partial<CreateEntryRequest>) {
    Object.assign(this, obj);
  }
}
