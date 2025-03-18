import { SearchEntry } from '@models/api/entry/search-entry';

export class LdapSearchResultHelper {
  static getPartialAttributes(x: SearchEntry, attributeName: string): string[] {
    return x.partial_attributes.find((x) => x.type == attributeName)?.vals ?? [];
  }
}
