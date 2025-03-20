import { Injectable } from '@angular/core';
import { LdapTreeService } from './ldap-tree.service';
import { Treenode } from 'multidirectory-ui-kit';
import { LdapEntry } from '@models/core/ldap/ldap-entry';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { NavigationNode } from '@models/core/navigation/navigation-node';

@Injectable({
  providedIn: 'root',
})
export class LdapTreeviewService {
  constructor(private ldap: LdapTreeService) {}

  private buildNextLevel(node: LdapEntry, entries: Map<string, LdapEntry>): NavigationNode[] {
    const children = Array.from(entries.keys()).filter((x) =>
      LdapNamesHelper.isDnChild(node.dn, x),
    );
    return children
      .filter((x) => entries.has(x))
      .map(
        (x) =>
          new NavigationNode({
            name: x,
            children: this.buildNextLevel(entries.get(x)!, entries),
            route: ['ldap'],
            routeData: { distinguishedName: x },
          }),
      );
  }

  async expand(dn: string): Promise<NavigationNode[]> {
    await this.ldap.expandToRoot(dn);
    const entries = this.ldap.getEntries();
    const rootDse = entries.get('');
    if (!rootDse) {
      return [];
    }

    return [
      new NavigationNode({
        name: rootDse.dn,
        children: this.buildNextLevel(rootDse, entries),
        expandable: true,
        route: ['ldap'],
        routeData: { distinguishedName: rootDse.dn },
      }),
    ];
  }
}
