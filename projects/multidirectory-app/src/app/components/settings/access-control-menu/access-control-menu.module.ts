import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccessControlMenuComponent } from "./access-control-menu.component";
import { AccessControlClientComponent } from "./access-control-client/access-cotnrol-client.component";
import { AccessControlClientCreateComponent } from "./access-control-client-create/access-control-client-create.component";
import { AccessGroupSelectorComponent } from "./access-control-group-selector/access-group-selector.component";
import { AccessControlClientModalComponent } from "./access-control-modal.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { EditorsModule } from "../../ldap-browser/editors/editors.module";

@NgModule({
    declarations: [ 
        AccessControlMenuComponent,
        AccessControlClientComponent,
        AccessControlClientCreateComponent,
        AccessGroupSelectorComponent,
        AccessControlClientModalComponent
    ],
    exports: [
        AccessControlClientComponent,
        AccessControlMenuComponent,
        AccessControlClientCreateComponent,
        AccessGroupSelectorComponent,
        AccessControlClientModalComponent
    ],
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule,
        EditorsModule
    ]
})
export class AccessControlModule {

}