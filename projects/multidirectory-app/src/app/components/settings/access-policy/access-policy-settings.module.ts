import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { EditorsModule } from "../../ldap-browser/editors/editors.module";
import { AccessPolicyCreateComponent } from "./access-policy-create/access-policy-create.component";
import { AccessGroupSelectorComponent } from "./access-policy-group-selector/access-group-selector.component";
import { AccessPolicySettingsComponent } from "./access-policy-settings.component";
import { AccessPolicyComponent } from "./access-policy/access-policy.component";

@NgModule({
    declarations: [ 
        AccessPolicySettingsComponent,
        AccessPolicyComponent,
        AccessPolicyCreateComponent,
        AccessGroupSelectorComponent,
    ],
    exports: [
        AccessPolicySettingsComponent,
        AccessPolicyComponent,
        AccessPolicyCreateComponent,
        AccessGroupSelectorComponent,
    ],
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule,
        EditorsModule
    ]
})
export class AccessPolicyModule {

}