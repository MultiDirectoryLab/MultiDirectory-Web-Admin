import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRouteGuard } from '@core/authorization/auth-route-guard';
import { SetupRouteGuard } from '@core/setup/setup-route-guard';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { DisplayErrorComponent } from './components/errors/display-error/display-error.component';
import { FooterComponent } from './components/app-layout/footer/footer.component';
import {
  DIALOG_COMPONENT_WRAPPER_CONFIG,
  DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG,
} from './components/modals/constants/dialog.constants';

const routes: Routes = [
  {
    path: 'setup',
    providers: [
      {
        provide: DIALOG_COMPONENT_WRAPPER_CONFIG,
        useValue: {
          ...DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG,
          draggable: false,
          closable: false,
        },
      },
    ],
    canActivate: [SetupRouteGuard],
    loadComponent: () =>
      import('./features/setup/setup/setup.component').then((c) => c.SetupComponent),
  },
  {
    path: 'login',
    providers: [
      {
        provide: DIALOG_COMPONENT_WRAPPER_CONFIG,
        useValue: {
          ...DIALOG_COMPONENT_WRAPPER_DEFAULT_CONFIG,
          draggable: false,
          closable: false,
        },
      },
    ],
    canActivate: [SetupRouteGuard, AuthRouteGuard],
    loadComponent: () => import('./features/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'settings',
    component: AppLayoutComponent,
    canActivate: [AuthRouteGuard],
    loadChildren: () =>
      import('./features/settings/app-settings.module').then((x) => x.AppSettingsModule),
  },
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
          import('./features/access-policy/access-policy.module').then((x) => x.AccessPolicyModule),
      },
      {
        path: 'password-policy',
        loadChildren: () =>
          import('./features/password-policy/password-policy.module').then(
            (x) => x.PasswordPolicyModule,
          ),
      },
      {
        path: 'ldap',
        loadChildren: () =>
          import('./features/ldap-browser/ldap-browser.module').then((x) => x.LdapBrowserModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./components/app-layout/placeholder/placeholder.module').then(
            (x) => x.PlaceholderModule,
          ),
      },
    ],
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [AuthRouteGuard],
})
export class AppRoutingModule {}
