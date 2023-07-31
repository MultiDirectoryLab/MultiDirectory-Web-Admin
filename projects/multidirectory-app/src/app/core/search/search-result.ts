import { LdapNode } from "../../core/ldap/ldap-loader";

export interface SearchResult {
    name: string,
    entry?: LdapNode;
}