import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

export interface newCatalogRow {
  object_name: string;
  partial_attributes: LdapAttribute[];
}
