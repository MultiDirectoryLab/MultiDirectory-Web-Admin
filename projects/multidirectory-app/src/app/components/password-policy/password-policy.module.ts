import { Component, NgModule } from "@angular/core";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { PasswordPolicyListComponent } from "./password-policy-list.component";
import { PasswordPolicyRoutingModule } from "./password-policy-routing.module";
import { TranslocoModule } from "@ngneat/transloco";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PasswordPolicyListItemComponent } from "./password-policy-list-item/password-policy-list-item.component";
import { CommonModule } from "@angular/common";
import { PasswordPolicyCreateComponent } from "./password-policy-create/password-policy-create.component";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../forms/validators/validators.module";
import { PasswordPolicyComponent } from "./password-policy/password-policy.component";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        ValidatorsModule,
        FormsModule,
        TranslocoModule,
        DragDropModule,
        PasswordPolicyRoutingModule
    ],
    declarations: [
        PasswordPolicyListComponent,
        PasswordPolicyListItemComponent,
        PasswordPolicyCreateComponent,
        PasswordPolicyComponent
    ]
})
export class PasswordPolicyModule {
}