import { LdapEntryNode } from "../ldap/ldap-entity";

export interface SearchResult {
    name: string,
    entry: LdapEntryNode | null;
}