import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { passwordPolicyRoutes } from '@features/password-policy/password-policy.route';

@NgModule({
  imports: [RouterModule.forChild(passwordPolicyRoutes)],
  exports: [RouterModule],
})
export class PasswordPolicyRoutingModule {}
