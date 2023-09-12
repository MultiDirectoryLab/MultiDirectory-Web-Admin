import { NgModule } from "@angular/core";
import { AppSettingsComponent } from "./app-settings.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../forms/validators/validators.module";
import { RouterModule } from "@angular/router";
import { AppSettingsNavigationComponent } from "./navigation/app-settings-navigation.component";
import { AccessControlModule } from "./access-control-menu/access-control-menu.module";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { MultifactorSettingsComponent } from "./mulifactor-settings/multifactor-settings.component";
import { AppSettingsRoutingModule } from "./app-settings-routes.module";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule,
        AccessControlModule,
        RouterModule,
        AppSettingsRoutingModule
    ],
    declarations: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        MultifactorSettingsComponent
    ],
    exports: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        MultifactorSettingsComponent,
        AppSettingsRoutingModule
    ]
})
export class AppSettingsModule {

}