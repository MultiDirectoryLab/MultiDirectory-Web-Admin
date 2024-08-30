import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { BulkFilterStrategy } from '../bulk-filter-strategy';

export class FilterControllableStrategy extends BulkFilterStrategy<LdapAttributes> {
  _controllableClasses = ['user', 'computer'];

  override filter(entry: LdapAttributes): boolean {
    const objectClasses = entry['objectClass'];
    const result = this._controllableClasses.reduce(
      (acc, curr) => acc || objectClasses.includes(curr),
      false,
    );
    return result;
  }
}
