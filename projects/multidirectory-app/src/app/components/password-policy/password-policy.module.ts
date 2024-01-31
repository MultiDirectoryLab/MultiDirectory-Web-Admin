import { Component, NgModule } from "@angular/core";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { PasswordPolicyListComponent } from "./password-policy-list.component";
import { PasswordPolicyRoutingModule } from "./password-policy-routing.module";
import { TranslocoModule } from "@ngneat/transloco";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PasswordPolicyListItemComponent } from "./password-policy-list-item/password-policy-list-item.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        TranslocoModule,
        DragDropModule,
        PasswordPolicyRoutingModule
    ],
    declarations: [PasswordPolicyListComponent, PasswordPolicyListItemComponent]
})
export class PasswordPolicyModule {
}