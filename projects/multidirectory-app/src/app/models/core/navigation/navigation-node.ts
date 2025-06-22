import { Treenode } from 'multidirectory-ui-kit';
import { LdapEntryType } from '../ldap/ldap-entry-type';

export class NavigationNode extends Treenode {
  route: string[] = [];
  routeData: { [key: string]: string } = {};
  icon: string = '';
  type: LdapEntryType = LdapEntryType.None;

  constructor(obj: Partial<NavigationNode>) {
    super(obj);
    Object.assign(this, obj);
  }
}
