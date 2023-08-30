import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";

export interface TableRow {
    icon?: string,
    name: string,
    type?: string,
    description: string;
    entry: LdapEntity;
}
