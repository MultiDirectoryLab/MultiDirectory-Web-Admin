import { PartialAttribute } from '@core/ldap/ldap-attributes/ldap-partial-attribute';

export interface SearchEntry {
  id?: string;
  object_name: string;
  partial_attributes: PartialAttribute[];
}
