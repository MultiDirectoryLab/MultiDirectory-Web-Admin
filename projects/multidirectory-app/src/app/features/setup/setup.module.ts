import { NgModule } from "@angular/core";
import { AdminSettingsComponent } from "./admin-settings/admin-settings.component";
import { AdminSettingsSecondComponent } from "./admin-settings-second/admin-settings-second.component";
import { DomainSettingsComponent } from "./domain-setttings/domain-settings.component";
import { SetupComponent } from "./setup/setup.component";
import { CommonModule } from "@angular/common";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { FormsModule } from "@angular/forms";
import { SetupRoutingModule } from "./setup-routing.module";
import { TranslocoRootModule } from "../../transloco-root.module";
import { ValidatorsModule } from "../../core/validators/validators.module";
import { ModalControlModule } from "../../core/modal-control/modal-control.module";

@NgModule({
    declarations: [
        AdminSettingsComponent,
        AdminSettingsSecondComponent,
        DomainSettingsComponent,
        SetupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MultidirectoryUiKitModule,
        TranslocoRootModule,
        ValidatorsModule,
        ModalControlModule,
        SetupRoutingModule
    ]
})
export class SetupModule {
}