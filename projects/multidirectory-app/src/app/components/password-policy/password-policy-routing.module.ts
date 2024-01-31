import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PasswordPolicyListComponent } from "./password-policy-list.component";
import { PasswordPolicyComponent } from "./password-policy/password-policy.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PasswordPolicyListComponent
            },
            {
                path: ':id',
                component: PasswordPolicyComponent
            }
        ])
    ]
})
export class PasswordPolicyRoutingModule {
}