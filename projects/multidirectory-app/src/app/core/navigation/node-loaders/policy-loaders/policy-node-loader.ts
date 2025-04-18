import { Injectable, inject } from '@angular/core';
import { AccessPolicyNodeLoader } from './access-policy-node-loader/access-policy-node-loader';
import { PasswordPolicyNodeLoader } from './password-policy-node-loader/password-policy-node-loader';
import { translate } from '@jsverse/transloco';
import { NavigationNode } from '@core/navigation/navigation-node';
import { Observable, of, zip, take, mergeMap } from 'rxjs';
import { NodeLoader } from '../node-loader';

@Injectable({
  providedIn: 'root',
})
export class PolicyNodeLoaders implements NodeLoader {
  private accessPolicyNodeLoader = inject(AccessPolicyNodeLoader);
  private passwordPolicyNodeLoader = inject(PasswordPolicyNodeLoader);

  policyLoaders: NodeLoader[] = [this.accessPolicyNodeLoader, this.passwordPolicyNodeLoader];
  get(): Observable<NavigationNode[]> {
    return of([
      new NavigationNode({
        name: translate('navigation.policy-loader.root-node-name'),
        icon: 'assets/keyicons.svg',
        id: 'server-policy-root',
        loadChildren: () => this.getChildren(),
      }),
    ]);
  }

  getChildren(): Observable<NavigationNode[]> {
    const branches = this.policyLoaders.map((x) => x.get());

    return zip(branches).pipe(
      take(1),
      mergeMap((x) => of(x.flatMap((y) => y))),
    );
  }
}
