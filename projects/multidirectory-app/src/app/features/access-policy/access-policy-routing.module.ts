import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessPolicySettingsComponent } from './access-policy-list.component';
import { AccessPolicyViewComponent } from './access-policy-view/access-policy-view.component';
import { AccessPolicyHeaderComponent } from './access-policy-header/access-policy-header.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        outlet: 'header',
        component: AccessPolicyHeaderComponent,
      },
      { path: '', component: AccessPolicySettingsComponent },
      { path: ':id', component: AccessPolicyViewComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AccessPolicyRoutingModule {}
