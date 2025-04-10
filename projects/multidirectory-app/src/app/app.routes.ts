import { Routes } from '@angular/router';
import { authRouteGuardCanActivateFn } from '@core/authorization/auth-route.can-activate.guard';
import { setupRouteGuardCanActivateFn } from '@core/setup/setup-route.can-activate.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/app-layout/app-layout.component').then((c) => c.AppLayoutComponent),
    canActivate: [authRouteGuardCanActivateFn],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/app-layout/footer/footer.component').then((c) => c.FooterComponent),
        outlet: 'footer',
      },
      {
        path: '',
        loadComponent: () =>
          import('./components/sidebar/navigation/navigation.component').then(
            (c) => c.NavigationComponent,
          ),
        outlet: 'sidebar',
      },
      {
        path: 'access-policy',
        loadChildren: () =>
          import('@features/access-policy/access-policy.routes').then((r) => r.accessPolicyRoutes),
      },
      {
        path: 'password-policy',
        loadChildren: () =>
          import('@features/password-policy/password-policy.routes').then(
            (r) => r.passwordPolicyRoutes,
          ),
      },
      {
        path: 'ldap',
        loadChildren: () =>
          import('@features/ldap-browser/ldap-browser.routes').then((r) => r.ldapBrowserRoutes),
      },
      {
        path: '',
        loadChildren: () =>
          import('./components/app-layout/placeholder/placeholder.routes').then(
            (r) => r.placeholderRoutes,
          ),
      },
    ],
  },
  {
    path: 'setup',
    canActivate: [setupRouteGuardCanActivateFn],
    loadChildren: () => import('@features/setup/setup.routes').then((r) => r.setupRoutes),
  },
  {
    path: 'login',
    canActivate: [setupRouteGuardCanActivateFn, authRouteGuardCanActivateFn],
    loadChildren: () => import('@features/login/login.routes').then((r) => r.loginRoutes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/app-layout/app-layout.component').then((c) => c.AppLayoutComponent),
    canActivate: [authRouteGuardCanActivateFn],
    loadChildren: () =>
      import('@features/settings/app-settings.routes').then((r) => r.appSettingsRoutes),
  },
  {
    path: 'enable-backend',
    loadComponent: () =>
      import('./components/errors/display-error/display-error.component').then(
        (c) => c.DisplayErrorComponent,
      ),
    data: { message: 'errors.enable-backend' },
  },
  {
    path: 'mfa_token_error',
    loadComponent: () =>
      import('./components/errors/display-error/display-error.component').then(
        (c) => c.DisplayErrorComponent,
      ),
    data: { message: 'errors.mfa-token-error' },
  },
  { path: '**', redirectTo: '' },
];
