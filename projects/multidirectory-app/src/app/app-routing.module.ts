import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRouteGuard } from './core/authorization/auth-route-guard';
import { SetupRouteGuard } from './core/setup/setup-route-guard';
import { BackendNotRespondedComponent } from './components/errors/backend-does-not-responded/backend-not-responded.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { PlaceholderComponent } from './components/app-layout/placeholder/placeholder.component';
import { PlaceholderHeaderComponent } from './components/app-layout/placeholder/placeholder-header/placeholder-header.component';

const routes: Routes = [
  { 
    path: 'setup', 
    canActivate: [ SetupRouteGuard ],
    loadChildren: () => import('./features/setup/setup.module').then(x => x.SetupModule)
  },
  { 
    path: 'login', 
    canActivate: [ SetupRouteGuard, AuthRouteGuard ],
    loadChildren: () => import('./features/login/login.module').then(x => x.LoginModule)
  },
  { 
    path: 'settings',
    component: AppLayoutComponent, 
    canActivate: [ AuthRouteGuard ],
    loadChildren: () => import('./features/settings/app-settings.module').then(x => x.AppSettingsModule)
  },
  { 
    path: '',
    component: AppLayoutComponent,
    canActivate: [ AuthRouteGuard ],
    children: [
      { 
        path: '',
        component: NavigationComponent,
        outlet: 'sidebar',
      },
      { 
        path: 'access-policy',
        loadChildren: () => import('./features/access-policy/access-policy.module').then(x => x.AccessPolicyModule)
      },
      { 
        path: 'password-policy',
        loadChildren: () => import('./features/password-policy/password-policy.module').then(x => x.PasswordPolicyModule)
      },
      {
        path: 'ldap', 
        loadChildren: () => import('./features/ldap-browser/ldap-browser.module').then(x => x.LdapBrowserModule)
      },
      {
        path: '', 
        loadChildren: () => import('./components/app-layout/placeholder/placeholder.module').then(x => x.PlaceholderModule)
      }
    ]
  },
  { path: 'enable-backend', component: BackendNotRespondedComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthRouteGuard]
})
export class AppRoutingModule { }
