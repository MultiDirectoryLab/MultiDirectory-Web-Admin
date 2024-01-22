import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthRouteGuard } from './core/authorization/auth-route-guard';
import { SetupComponent } from './components/setup/setup.component';
import { SetupRouteGuard } from './core/setup/setup-route-guard';
import { BackendNotRespondedComponent } from './components/errors/backend-does-not-responded/backend-not-responded.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { HomeComponent } from './components/ldap-browser/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/ldap-browser/header/header.component';
import { AccessPolicySettingsComponent } from './components/settings/access-policy/access-policy-settings.component';
import { MultifactorSettingsComponent } from './components/settings/mulifactor-settings/multifactor-settings.component';
import { MultidirectorySettingsComponent } from './components/settings/multidirectory-settings/multidirectory-settings.component';
import { AppSettingsNavigationComponent } from './components/settings/navigation/app-settings-navigation.component';
import { NavigationComponent } from './components/ldap-browser/navigation/navigation.component';
import { AccessPolicyComponent } from './components/settings/access-policy/access-policy/access-policy.component';
import { AccessPolicyViewComponent } from './components/settings/access-policy/access-policy-view/access-policy-view.component';

const routes: Routes = [
  { path: 'setup', component: SetupComponent, canActivate: [ SetupRouteGuard ]  },
  { path: 'login', component: LoginComponent, canActivate: [ SetupRouteGuard, AuthRouteGuard ] },
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
      },
      { path: '', component: HeaderComponent, outlet: 'header' },
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
      { path: '', component: HeaderComponent, outlet: 'header' },
      
      { 
        path: 'access-policy',
        canActivate: [ AuthRouteGuard ],
        children: [
          {path: '', component: AccessPolicySettingsComponent},
          {path: ':id', component: AccessPolicyViewComponent}
        ]
      },
      {
        path: '', 
        children: [
          { path: '', component: HomeComponent },
          { path: ':query', component: HomeComponent},
        ]
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
