import { LdapEntryNode } from '@models/core/ldap/ldap-entity';

export interface SearchResult {
  name: string;
  entry: LdapEntryNode;
}
