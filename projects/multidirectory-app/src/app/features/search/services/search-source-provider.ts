import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { SearchType } from '../models/search-type';
import { SearchSource } from '../models/search-source';
import { NavigationNode } from '@models/core/navigation/navigation-node';

@Injectable()
export class SearchSourceProvider {
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
    return of([]); //this.ldap.get().pipe(map(mapNode));
  }
}
