import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { loginRoutes } from '@features/login/login.route';

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
