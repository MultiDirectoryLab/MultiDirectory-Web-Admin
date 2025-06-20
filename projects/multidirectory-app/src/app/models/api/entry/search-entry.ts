import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

export interface SearchEntry {
  object_name: string;
  partial_attributes: LdapAttribute[];
}
