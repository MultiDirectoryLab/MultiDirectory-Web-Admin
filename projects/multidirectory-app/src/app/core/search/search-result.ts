import { LdapEntity } from "../ldap/ldap-entity";

export interface SearchResult {
    name: string,
    entry: LdapEntity | null;
}