import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { accessPolicyRoutes } from '@features/access-policy/access-policy.route';

@NgModule({
  imports: [RouterModule.forChild(accessPolicyRoutes)],
  exports: [RouterModule],
})
export class AccessPolicyRoutingModule {}
