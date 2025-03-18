import { LdapEntryNode } from '@models/core/ldap/ldap-entity';

export interface TableRow {
  icon: string;
  name: string;
  type: string;
  description: string;
  entry: LdapEntryNode;
}
