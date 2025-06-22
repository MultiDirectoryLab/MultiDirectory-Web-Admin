import { Injectable } from '@angular/core';
import { LdapTreeService } from './ldap-tree.service';
import { LdapEntry } from '@models/core/ldap/ldap-entry';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';

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
      .map((x) => this.createNode(entries.get(x)!, entries));
  }

  private createNode(entry: LdapEntry, entries: Map<string, LdapEntry>): NavigationNode {
    let newNode;
    if (this._nodes.has(entry.dn)) {
      newNode = this._nodes.get(entry.dn)!;
    }

    newNode = new NavigationNode({
      ...newNode,
      id: entry.dn,
      name: LdapNamesHelper.getDnName(entry.dn).split('=')[1],
      children: this.buildNextLevel(entry, entries),
      expandable: true,
      route: ['ldap'],
      routeData: { distinguishedName: entry.dn },
      icon: EntityInfoResolver.resolveIcon(entry.type),
      type: entry.type,
    });

    this._nodes.set(entry.dn, newNode);

    return newNode;
  }

  async load(dn: string): Promise<NavigationNode[]> {
    await this.ldap.load(dn);
    const entries = this.ldap.getEntries();
    const rootDse = entries.get('');
    if (!rootDse) {
      return [];
    }
    const rootNodes = [this.createNode(rootDse, entries)];
    return rootNodes;
  }

  setPathExpanded(dn: string) {
    let currentDn = dn;
    do {
      const node = this._nodes.get(currentDn);
      if (!node) {
        break;
      }
      node.expanded = true;
      currentDn = LdapNamesHelper.getDnParent(currentDn);
    } while (!!currentDn);
  }

  setExpanded(dn: string, expanded = true) {
    const node = this._nodes.get(dn);
    if (!node) {
      return;
    }
    node.expanded = expanded;
  }

  setSelected(dn: string, selected = true) {
    this._nodes.forEach((node) => (node.selected = false));
    const node = this._nodes.get(dn);
    if (!node) {
      return;
    }
    node.selected = selected;
  }

  invalidate(distinguisedNames: string[]) {
    distinguisedNames.forEach((dn) => {
      this._nodes.delete(dn);
      this.ldap.invalidate(dn);
    });
  }
}
