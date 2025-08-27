import { Routes } from '@angular/router';

export const appPoliciesRoutes: Routes = [
  {
    path: '',
    outlet: 'sidebar',
    loadComponent: () =>
      import('@features/policies/navigation/policies-navigation.component').then(
        (c) => c.PoliciesNavigationComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'password-policies',
    pathMatch: 'full',
  },
  {
    path: 'access-policies',
    loadChildren: () =>
      import('@features/policies/access-policy/access-policy.routes').then(
        (r) => r.accessPolicyRoutes,
      ),
  },
  {
    path: 'password-policies',
    loadChildren: () =>
      import('@features/policies/password-policy/password-policy.routes').then(
        (r) => r.passwordPolicyRoutes,
      ),
  },
];
