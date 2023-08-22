import { NgModule } from "@angular/core";
import { UserCreatePasswordSettingsComponent } from "./password-settings/password-settings.component";
import { UserCreateSummaryComponent } from "./summary/summary.component";
import { UserCreateGeneralInfoComponent } from "./general-info/general-info.component";
import { UserCreateComponent } from "./user-create.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidatorsModule } from "../validators/validators.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MultidirectoryUiKitModule,
        ValidatorsModule
    ],
    declarations: [
        UserCreateComponent,
        UserCreateGeneralInfoComponent,
        UserCreatePasswordSettingsComponent,
        UserCreateSummaryComponent
    ],
    exports: [
        UserCreateComponent,
        UserCreateGeneralInfoComponent,
        UserCreatePasswordSettingsComponent,
        UserCreateSummaryComponent
    ]
})
export class UserCreateModule {}