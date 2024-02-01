import { NgModule } from "@angular/core";
import { CatalogSelectorModule } from "./catalog-selector/catalog-selector.module";
import { EntityTypeSelectorModule } from "./entity-type-selector/entity-type-selector.module";
import { GroupCreateComponent } from "./group-create/group-create.component";
import { OuCreateComponent } from "./ou-create/ou-create.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { GroupSelectorModule } from "./group-selector/group-selector.module";
import { TranslocoRootModule } from "../../transloco-root.module";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../../core/validators/validators.module";
import { UserCreateSummaryComponent } from "./user-create/summary/summary.component";
import { UserCreatePasswordSettingsComponent } from "./user-create/password-settings/password-settings.component";
import { UserCreateGeneralInfoComponent } from "./user-create/general-info/general-info.component";

@NgModule({
    declarations: [
        GroupCreateComponent,
        OuCreateComponent,
        UserCreateComponent,
        UserCreateSummaryComponent,
        UserCreatePasswordSettingsComponent,
        UserCreateGeneralInfoComponent,
    ],
    exports: [
        GroupCreateComponent,
        OuCreateComponent,
        UserCreateComponent,
        GroupSelectorModule
    ],
    imports: [
        CatalogSelectorModule,
        EntityTypeSelectorModule,
        GroupSelectorModule,
        MultidirectoryUiKitModule,
        CommonModule,
        FormsModule,
        ValidatorsModule,
        TranslocoRootModule
    ]
})
export class AppFormsModule {
}