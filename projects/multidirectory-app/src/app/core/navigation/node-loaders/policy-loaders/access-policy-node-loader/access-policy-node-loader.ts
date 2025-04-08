import { Observable, map, of } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { translate } from '@jsverse/transloco';
import { NodeLoader } from '../../node-loader';
import { NavigationNode } from '@core/navigation/navigation-node';

@Injectable({
  providedIn: 'root',
})
export class AccessPolicyNodeLoader implements NodeLoader {
  private api = inject(MultidirectoryApiService);

  get(): Observable<NavigationNode[]> {
    return of([
      new NavigationNode({
        id: 'accessPolicy',
        name: translate('navigation.policy-loader.access-policy-root-name'),
        selectable: true,
        route: ['access-policy'],
        icon: 'assets/lock.svg',
        loadChildren: this.getChildren.bind(this),
      }),
    ]);
  }

  getChildren(): Observable<NavigationNode[]> {
    const result = this.api.getAccessPolicy().pipe(
      map((x) =>
        x.map(
          (policy) =>
            new NavigationNode({
              id: 'policy ' + policy.id,
              name: policy.name,
              selectable: true,
              expanded: true,
              icon: 'assets/lock.svg',
              route: ['access-policy', policy.id],
            }),
        ),
      ),
    );
    return result;
  }
}
