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
  private _nodes = new Map<string, NavigationNode>();

  constructor(private ldap: LdapTreeService) {}

  private buildNextLevel(node: LdapEntry, entries: Map<string, LdapEntry>): NavigationNode[] {
    const children = Array.from(entries.keys()).filter((x) =>
      LdapNamesHelper.isDnChild(node.dn, x),
    );
    return children
      .filter((x) => entries.has(x))
      .map((x) => this.getNode(entries.get(x)!, entries));
  }

  private getNode(entry: LdapEntry, entries: Map<string, LdapEntry>): NavigationNode {
    if (this._nodes.has(entry.dn)) {
      let oldNode = this._nodes.get(entry.dn)!;
      oldNode = new NavigationNode({
        ...oldNode,
        children: this.buildNextLevel(entry, entries),
      });
      this._nodes.set(entry.dn, oldNode);
      return oldNode;
    }

    const newNode = new NavigationNode({
      name: entry.dn,
      children: this.buildNextLevel(entry, entries),
      expandable: true,
      route: ['ldap'],
      routeData: { distinguishedName: entry.dn },
    });
    this._nodes.set(entry.dn, newNode);
    return newNode;
  }

  async expand(dn: string): Promise<NavigationNode[]> {
    await this.ldap.expandToRoot(dn);
    const entries = this.ldap.getEntries();
    const rootDse = entries.get('');
    if (!rootDse) {
      return [];
    }

    return [this.getNode(rootDse, entries)];
  }

  toggleVisible(dn: string) {
    const node = this._nodes.get(dn);
    if (!node) {
      return;
    }
    node.expanded = !node?.expanded;
  }

  toggleSelected(dn: string) {
    const node = this._nodes.get(dn);
    if (!node) {
      return;
    }
    node.selected = !node?.selected;
  }
}
