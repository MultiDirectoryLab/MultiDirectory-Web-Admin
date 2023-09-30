import { NgModule } from "@angular/core";
import { AppSettingsComponent } from "./app-settings.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../forms/validators/validators.module";
import { RouterModule } from "@angular/router";
import { AppSettingsNavigationComponent } from "./navigation/app-settings-navigation.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { MultifactorSettingsComponent } from "./mulifactor-settings/multifactor-settings.component";
import { AppSettingsRoutingModule } from "./app-settings-routes.module";
import { AppSettingsHeaderComponent } from "./header/app-settings-header.component";
import { AccessPolicyModule } from "./access-policy/access-policy-settings.module";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule,
        AccessPolicyModule,
        RouterModule,
        AppSettingsRoutingModule,
        DragDropModule
    ],
    declarations: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        AppSettingsHeaderComponent,
        MultifactorSettingsComponent
    ],
    exports: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        MultifactorSettingsComponent,
        AppSettingsRoutingModule,
        AppSettingsHeaderComponent
    ]
})
export class AppSettingsModule {

}