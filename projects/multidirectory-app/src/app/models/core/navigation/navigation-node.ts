import { Treenode } from 'multidirectory-ui-kit';
import { LdapEntryType } from '../ldap/ldap-entry-type';
import { LdapAttribute } from '@core/ldap/ldap-attributes/ldap-attribute';

export class NavigationNode extends Treenode {
  route: string[] = [];
  routeData: { [key: string]: string } = {};
  icon: string = '';
  type: LdapEntryType = LdapEntryType.None;
  attributes: LdapAttribute[] = [];
  constructor(obj: Partial<NavigationNode>) {
    super(obj);
    Object.assign(this, obj);
  }
}
