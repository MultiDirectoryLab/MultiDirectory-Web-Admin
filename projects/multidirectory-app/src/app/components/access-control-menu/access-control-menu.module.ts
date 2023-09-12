import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { AccessControlMenuComponent } from "./access-control-menu.component";
import { AccessControlClientComponent } from "./access-control-client/access-cotnrol-client.component";
import { AccessControlClientCreateComponent } from "./access-control-client-create/access-control-client-create.component";
import { ValidatorsModule } from "../forms/validators/validators.module";
import { AccessGroupSelectorComponent } from "./access-control-group-selector/access-group-selector.component";
import { EditorsModule } from "../ldap-browser/editors/editors.module";

@NgModule({
    declarations: [ 
        AccessControlMenuComponent,
        AccessControlClientComponent,
        AccessControlClientCreateComponent,
        AccessGroupSelectorComponent
    ],
    exports: [
        AccessControlClientComponent,
        AccessControlMenuComponent,
        AccessControlClientCreateComponent,
        AccessGroupSelectorComponent
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