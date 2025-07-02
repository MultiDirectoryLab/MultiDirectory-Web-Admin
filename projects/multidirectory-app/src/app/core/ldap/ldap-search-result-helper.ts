import { SearchEntry } from '@models/api/entry/search-entry';
import { LdapAttribute } from './ldap-attributes/ldap-attribute';

export class LdapSearchResultHelper {
  static getLdapAttributes(partial_attributes: LdapAttribute[], attributeName: string): string[] {
    return (
      partial_attributes.find(
        (x) => x.type.toLocaleLowerCase() == attributeName.toLocaleLowerCase(),
      )?.vals ?? []
    );
  }
}
