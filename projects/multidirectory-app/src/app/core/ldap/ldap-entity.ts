import { LdapEntryType } from './ldap-entity-type';
import { SearchEntry } from '@models/entry/search-response';
import { EntityInfoResolver } from './entity-info-resolver';
import { NavigationNode } from '@core/navigation/navigation-node';
import { PartialAttribute } from './ldap-attributes/ldap-partial-attribute';

export class LdapEntryNode extends NavigationNode {
  override parent?: LdapEntryNode;
  type: LdapEntryType = LdapEntryType.None;
  entry?: SearchEntry;
  clickAction?: (node: LdapEntryNode) => void = undefined;

  constructor(obj: Partial<LdapEntryNode>) {
    super({});
    Object.assign(this, obj);
    this.icon = EntityInfoResolver.resolveIcon(this.type);
  }

  getAttibute(key: string): PartialAttribute | undefined {
    const index =
      this.entry?.partial_attributes?.findIndex((x) => x.type == 'userAccountControl') ?? -1;
    if (index < 0) {
      return undefined;
    }
    return this.entry?.partial_attributes[index];
  }
}
