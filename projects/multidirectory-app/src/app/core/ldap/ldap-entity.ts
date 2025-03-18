import { LdapEntryType } from './ldap-entity-type';
import { EntityInfoResolver } from './entity-info-resolver';
import { NavigationNode } from '@core/navigation/navigation-node';
import { PartialAttribute } from './ldap-attributes/ldap-partial-attribute';
import { SearchEntry } from '@models/api/entry/search-entry';

export class LdapEntryNode extends NavigationNode {
  override parent?: LdapEntryNode;
  type: LdapEntryType = LdapEntryType.None;
  clickAction?: (node: LdapEntryNode) => void = undefined;
  // TO BE DELETED FROM ENTRY NODE
  entry?: SearchEntry;

  constructor(obj: Partial<LdapEntryNode>) {
    super({});
    Object.assign(this, obj);
    this.icon = EntityInfoResolver.resolveIcon(this.type);
  }

  // move outside
  getAttibute(key: string): PartialAttribute | undefined {
    const index = this.entry?.partial_attributes?.findIndex((x) => x.type == key) ?? -1;
    if (index < 0) {
      return undefined;
    }
    return this.entry?.partial_attributes[index];
  }
}
