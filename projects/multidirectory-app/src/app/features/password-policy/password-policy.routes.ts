import { Routes } from '@angular/router';
import { PasswordPolicyHeaderComponent } from '@features/password-policy/password-policy-header/password-policy-header.component';
import { PasswordPolicyListComponent } from '@features/password-policy/password-policy-list.component';
import { PasswordPolicyComponent } from '@features/password-policy/password-policy/password-policy.component';

export const passwordPolicyRoutes: Routes = [
  {
    path: '',
    outlet: 'header',
    component: PasswordPolicyHeaderComponent,
  },
  {
    path: '',
    component: PasswordPolicyListComponent,
  },
  {
    path: ':id',
    component: PasswordPolicyComponent,
  },
];
