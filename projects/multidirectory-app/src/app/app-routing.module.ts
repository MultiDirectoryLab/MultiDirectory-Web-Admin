import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRouteGuard } from './core/authorization/auth-route-guard';
import { SetupRouteGuard } from './core/setup/setup-route-guard';
import { BackendNotRespondedComponent } from './components/errors/backend-does-not-responded/backend-not-responded.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MultifactorSettingsComponent } from './components/settings/mulifactor-settings/multifactor-settings.component';
import { MultidirectorySettingsComponent } from './components/settings/multidirectory-settings/multidirectory-settings.component';
import { AppSettingsNavigationComponent } from './components/settings/navigation/app-settings-navigation.component';
import { NavigationComponent } from './components/sidebar/navigation/navigation.component';
import { AccessPolicySettingsComponent } from './features/access-policy/access-policy-list.component';

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
    children: [
      {
        path: '',
        component: AccessPolicySettingsComponent,
        canActivate: [ AuthRouteGuard ]
      },
      {
          path: 'multifactor',
          component: MultifactorSettingsComponent,
          canActivate: [ AuthRouteGuard ]
      },
      {
          path: 'multidirectory',
          component: MultidirectorySettingsComponent,
      },
      { 
        path: '',
        component: SidebarComponent,
        outlet: 'sidebar',
        children: [{ path: '', component: AppSettingsNavigationComponent}] 
      }
    ]
  },
  { 
    path: '',
    component: AppLayoutComponent,
    canActivate: [ AuthRouteGuard ],
    children: [
      { 
        path: '',
        component: SidebarComponent,
        outlet: 'sidebar',
        children: [{ path: '', component: NavigationComponent }] 
      },
      { 
        path: 'access-policy',
        canActivate: [ AuthRouteGuard ],
        loadChildren: () => import('./features/access-policy/access-policy.module')
        .then(x => x.AccessPolicyModule)
      },
      { 
        path: 'password-policy',
        canActivate: [ AuthRouteGuard ],
        loadChildren: () => import('./features/password-policy/password-policy.module')
                              .then(x => x.PasswordPolicyModule)
      },
      {
        path: '', 
        loadChildren: () => import('./features/ldap-browser/ldap-browser.module').then(x => x.LdapBrowserModule)
      }
    ]
  },
  { path: 'enable-backend', component: BackendNotRespondedComponent },
  { path: '**', redirectTo: '/catalog'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthRouteGuard]
})
export class AppRoutingModule { }
