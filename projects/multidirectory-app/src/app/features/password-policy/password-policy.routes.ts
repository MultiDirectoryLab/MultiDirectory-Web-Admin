import { Routes } from '@angular/router';

export const passwordPolicyRoutes: Routes = [
  {
    path: '',
    outlet: 'header',
    loadComponent: () =>
      import(
        '@features/password-policy/password-policy-header/password-policy-header.component'
      ).then((c) => c.PasswordPolicyHeaderComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('@features/password-policy/password-policy-list.component').then(
        (c) => c.PasswordPolicyListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@features/password-policy/password-policy/password-policy.component').then(
        (c) => c.PasswordPolicyComponent,
      ),
  },
];
