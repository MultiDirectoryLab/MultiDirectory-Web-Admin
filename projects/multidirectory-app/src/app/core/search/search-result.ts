import { LdapEntity } from "../../core/ldap/ldap-loader";

export interface SearchResult {
    name: string,
    entry: LdapEntity | null;
}