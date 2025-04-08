import { Routes } from '@angular/router';
import { AccessPolicyHeaderComponent } from '@features/access-policy/access-policy-header/access-policy-header.component';
import { AccessPolicySettingsComponent } from '@features/access-policy/access-policy-list.component';
import { AccessPolicyViewComponent } from '@features/access-policy/access-policy-view/access-policy-view.component';

export const accessPolicyRoutes: Routes = [
  {
    path: '',
    outlet: 'header',
    component: AccessPolicyHeaderComponent,
  },
  { path: '', component: AccessPolicySettingsComponent },
  { path: ':id', component: AccessPolicyViewComponent },
];
