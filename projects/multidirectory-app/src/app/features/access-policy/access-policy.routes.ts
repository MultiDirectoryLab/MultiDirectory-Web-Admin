import { Routes } from '@angular/router';

export const accessPolicyRoutes: Routes = [
  {
    path: '',
    outlet: 'header',
    loadComponent: () =>
      import('@features/access-policy/access-policy-header/access-policy-header.component').then(
        (c) => c.AccessPolicyHeaderComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('@features/access-policy/access-policy-list.component').then(
        (c) => c.AccessPolicySettingsComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@features/access-policy/access-policy-view/access-policy-view.component').then(
        (c) => c.AccessPolicyViewComponent,
      ),
  },
];
