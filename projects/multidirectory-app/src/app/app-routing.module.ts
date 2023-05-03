import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRouteGuard } from './core/authorization/auth-route-guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '**', component: HomeComponent, canActivate: [ AuthRouteGuard ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthRouteGuard]
})
export class AppRoutingModule { }
