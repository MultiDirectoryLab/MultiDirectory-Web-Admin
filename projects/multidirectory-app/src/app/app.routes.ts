import { Routes } from '@angular/router';
import { authRouteGuardCanActivateFn } from '@core/authorization/auth-route.can-activate.guard';
import { setupRouteGuardCanActivateFn } from '@core/setup/setup-route.can-activate.guard';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { FooterComponent } from './components/app-layout/footer/footer.component';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authRouteGuardCanActivateFn],
    children: [
      {
        path: '',
        component: FooterComponent,
        outlet: 'footer',
      },
      {
        path: '',
        component: NavigationComponent,
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
    component: AppLayoutComponent,
    canActivate: [authRouteGuardCanActivateFn],
    loadChildren: () =>
      import('@features/settings/app-settings.routes').then((r) => r.appSettingsRoutes),
  },
  {
    path: 'enable-backend',
    component: DisplayErrorComponent,
    data: { message: 'errors.enable-backend' },
  },
  {
    path: 'mfa_token_error',
    component: DisplayErrorComponent,
    data: { message: 'errors.mfa-token-error' },
  },
  { path: '**', redirectTo: '' },
];
