import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { EditorsModule } from "../../ldap-browser/editors/editors.module";
import { AccessPolicyCreateComponent } from "./access-policy-create/access-policy-create.component";
import { AccessPolicySettingsComponent } from "./access-policy-settings.component";
import { AccessPolicyComponent } from "./access-policy/access-policy.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AccessPolicyIpListComponent } from "./access-policy-ip-list/access-policy-ip-list.component";
import { TranslocoModule } from "@ngneat/transloco";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { GroupSelectorModule } from "../../forms/group-selector/group-selector.module";
import { AccessPolicyViewComponent } from "./access-policy-view/access-policy-view.component";

@NgModule({
    declarations: [ 
        AccessPolicySettingsComponent,
        AccessPolicyComponent,
        AccessPolicyCreateComponent,
        AccessPolicyIpListComponent,
        AccessPolicyViewComponent
    ],
    exports: [
        AccessPolicySettingsComponent,
        AccessPolicyComponent,
        AccessPolicyCreateComponent,
        AccessPolicyIpListComponent,
        AccessPolicyViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MultidirectoryUiKitModule,
        ValidatorsModule,
        EditorsModule,
        GroupSelectorModule,
        DragDropModule,
        TranslocoModule,
    ]
})
export class AccessPolicyModule {

}