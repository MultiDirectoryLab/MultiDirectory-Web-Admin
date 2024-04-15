import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PasswordPolicyListComponent } from "./password-policy-list.component";
import { PasswordPolicyComponent } from "./password-policy/password-policy.component";
import { PasswordPolicyHeaderComponent } from "./password-policy-header/password-policy-header.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                outlet: 'header',
                component: PasswordPolicyHeaderComponent
            },
            {
                path: '',
                component: PasswordPolicyListComponent
            },
            {
                path: ':id',
                component: PasswordPolicyComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class PasswordPolicyRoutingModule {
}