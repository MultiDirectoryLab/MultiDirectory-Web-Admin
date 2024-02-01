import { NgModule } from "@angular/core";
import { AppSettingsComponent } from "./app-settings.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppSettingsNavigationComponent } from "./navigation/app-settings-navigation.component";
import { MultifactorSettingsComponent } from "./mulifactor-settings/multifactor-settings.component";
import { AppSettingsRoutingModule } from "./app-settings-routes.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MultidirectorySettingsComponent } from "./multidirectory-settings/multidirectory-settings.component";
import { MfAdminIntegrationComponent } from "./mulifactor-settings/admin-integration/mf-admin-integration.component";
import { MfUserIntegrationComponent } from "./mulifactor-settings/user-integration/mf-user-integration.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { TranslocoModule } from "@ngneat/transloco";
import { ValidatorsModule } from "../../core/validators/validators.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ValidatorsModule,
        RouterModule,
        AppSettingsRoutingModule,
        DragDropModule,
        TranslocoModule,
        MultidirectoryUiKitModule,
        RouterModule
    ],
    declarations: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        MultifactorSettingsComponent,
        MultidirectorySettingsComponent,
        MfAdminIntegrationComponent,
        MfUserIntegrationComponent
    ],
    exports: [
        AppSettingsComponent,
        AppSettingsNavigationComponent,
        MultifactorSettingsComponent,
        AppSettingsRoutingModule,
        MultidirectorySettingsComponent
    ]
})
export class AppSettingsModule {
}