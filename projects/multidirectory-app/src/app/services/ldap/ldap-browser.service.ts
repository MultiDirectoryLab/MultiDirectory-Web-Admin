import { inject, Injectable } from '@angular/core';
import { EntityInfoResolver } from '@core/ldap/entity-info-resolver';
import { LdapNamesHelper } from '@core/ldap/ldap-names-helper';
import { LdapSearchResultHelper } from '@core/ldap/ldap-search-result-helper';
import { SearchQueries } from '@core/ldap/search';
import { LdapBrowserEntry } from '@models/core/ldap-browser/ldap-browser-entry';
import { LdapEntry } from '@models/core/ldap/ldap-entry';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { lastValueFrom, map, of, tap, zip } from 'rxjs';
import { LdapTreeService } from './ldap-tree.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class LdapBrowserService {
  private _ldapMap = new Map<string, LdapBrowserEntry>();

  private api = inject(MultidirectoryApiService);
  private ldap = inject(LdapTreeService);

  async loadContent(
    parentDn: string,
    query: string,
    offset = 0,
    limit = 1,
  ): Promise<[LdapBrowserEntry[], number, number]> {
    await this.ldap.load(parentDn);
    const entries = this.ldap.getEntries();
    const parent = entries.get(parentDn);
    if (!parent) {
      return [[], 10, 10];
    }

    const children = Array.from(entries.values()).filter((x) =>
      LdapNamesHelper.isDnChild(parent.dn, x.dn),
    );

    const childrenNodes = children.map(
      (x) =>
        new LdapBrowserEntry({
          description: EntityInfoResolver.getNodeDescription(x),
          dn: x.dn,
          id: x.dn,
          icon: EntityInfoResolver.resolveIcon(x.type),
          name: LdapNamesHelper.getDnName(x.dn).split('=')[1],
          expandable: EntityInfoResolver.isExpandable(x.objectClasses),
          type: x.type,
          attributes: x.attributes,
        }),
    );
    console.log(childrenNodes);

    return [childrenNodes, childrenNodes.length, childrenNodes.length];
  }

  isExpandable(dn: string) {
    return this._ldapMap.get(dn)?.expandable ?? false;
  }
  // pdn        |
  // query      |--->
  // page_size  |
}
