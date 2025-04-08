import { Routes } from '@angular/router';
import { AuthRouteGuard } from '@core/authorization/auth-route-guard';
import { SetupRouteGuard } from '@core/setup/setup-route-guard';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { FooterComponent } from './components/app-layout/footer/footer.component';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthRouteGuard],
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
          import('./features/access-policy/access-policy.route').then((r) => r.accessPolicyRoute),
      },
      {
        path: 'password-policy',
        loadChildren: () =>
          import('./features/password-policy/password-policy.route').then(
            (r) => r.passwordPolicyRoute,
          ),
      },
      {
        path: 'ldap',
        loadChildren: () =>
          import('./features/ldap-browser/ldap-browser.route').then((r) => r.ldapBrowserRoute),
      },
      {
        path: '',
        loadChildren: () =>
          import('./components/app-layout/placeholder/placeholder.route').then(
            (r) => r.placeholderRoute,
          ),
      },
    ],
  },
  {
    path: 'setup',
    canActivate: [SetupRouteGuard],
    loadChildren: () => import('./features/setup/setup.route').then((r) => r.setupRoute),
  },
  {
    path: 'login',
    canActivate: [SetupRouteGuard, AuthRouteGuard],
    loadChildren: () => import('./features/login/login.route').then((r) => r.loginRoute),
  },
  {
    path: 'settings',
    component: AppLayoutComponent,
    canActivate: [AuthRouteGuard],
    loadChildren: () =>
      import('./features/settings/app-settings.route').then((r) => r.appSettingsRoute),
  },
  {
    path: 'enable-backend',
    component: DisplayErrorComponent,
    data: {
      message: 'errors.enable-backend',
    },
  },
  {
    path: 'mfa_token_error',
    component: DisplayErrorComponent,
    data: { message: 'errors.mfa-token-error' },
  },
  { path: '**', redirectTo: '' },
];
