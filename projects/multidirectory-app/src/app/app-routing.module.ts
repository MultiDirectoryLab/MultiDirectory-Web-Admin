import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthRouteGuard } from './core/authorization/auth-route-guard';
import { SetupComponent } from './components/setup/setup.component';
import { SetupRouteGuard } from './core/setup/setup-route-guard';
import { AppSettingsComponent } from './components/settings/app-settings.component';
import { HomeComponent } from './components/ldap-browser/home/home.component';

const routes: Routes = [
  { path: 'setup', component: SetupComponent, canActivate: [ SetupRouteGuard, AuthRouteGuard ]  },
  { path: 'login', component: LoginComponent, canActivate: [ SetupRouteGuard, AuthRouteGuard ] },
  {
    path: 'settings',
    component: AppSettingsComponent, 
    canActivate: [ AuthRouteGuard ],
    loadChildren: () => import('./components/settings/app-settings.module').then(m => m.AppSettingsModule)
  },
  { path: '', component: HomeComponent, canActivate: [ AuthRouteGuard ]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthRouteGuard]
})
export class AppRoutingModule { }
