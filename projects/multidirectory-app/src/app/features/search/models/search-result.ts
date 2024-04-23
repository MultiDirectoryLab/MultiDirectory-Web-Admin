import { LdapEntryNode } from "@core/ldap/ldap-entity";

export interface SearchResult {
    name: string,
    entry: LdapEntryNode;
}