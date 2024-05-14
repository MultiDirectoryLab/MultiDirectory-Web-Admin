import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

export enum LdapOperation {
  Add = 0,
  Delete = 1,
  Replace = 2,
}
export class LdapChange {
  operation: number = 0;
  modification: PartialAttribute | null = null;

  constructor(obj: Partial<LdapChange>) {
    Object.assign(this, obj);
  }
}

export class UpdateEntryRequest {
  object: string = '';
  changes: LdapChange[] = [];

  constructor(obj: Partial<UpdateEntryRequest>) {
    Object.assign(this, obj);
  }
}
