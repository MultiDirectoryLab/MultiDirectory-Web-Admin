import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRouteGuard } from './core/authorization/auth-route-guard';
import { SetupComponent } from './components/setup/setup.component';
import { SetupRouteGuard } from './core/setup/setup-route-guard';

const routes: Routes = [
  { path: 'setup', component: SetupComponent, canActivate: [ SetupRouteGuard ]  },
  { path: 'login', component: LoginComponent, canActivate: [ SetupRouteGuard ] },
  { path: '', component: HomeComponent, canActivate: [ AuthRouteGuard ]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthRouteGuard]
})
export class AppRoutingModule { }
