import { inject, Injectable } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';
import { SearchType } from '../models/search-type';
import { SearchSource } from '../models/search-source';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';

@Injectable()
export class SearchSourceProvider {
  private ldapTreeview = inject(LdapTreeviewService);
  getSearchSources(type: SearchType): Observable<SearchSource[]> {
    if (type == SearchType.Ldap) {
      return this.getLdapSources();
    }

    if (type == SearchType.Policies) {
      // TODO
      return of([]);
    }
    return of([]);
  }

  private getLdapSources(): Observable<SearchSource[]> {
    const mapNode = (nodes: NavigationNode[]) =>
      nodes.map(
        (x) =>
          new SearchSource({
            title: x.name,
            type: SearchType.Ldap,
            data: x,
          }),
      );
    return from(this.ldapTreeview.load('')).pipe(map(mapNode));
  }
}
