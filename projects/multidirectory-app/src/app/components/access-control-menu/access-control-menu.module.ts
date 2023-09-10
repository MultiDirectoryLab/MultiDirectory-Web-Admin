import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { AccessControlMenuComponent } from "./access-control-menu.component";
import { AccessControlClientComponent } from "./access-control-client/access-cotnrol-client.component";
import { AccessControlClientCreateComponent } from "./access-control-client-create/access-control-client-create.component";
import { ValidatorsModule } from "../forms/validators/validators.module";

@NgModule({
    declarations: [ 
        AccessControlMenuComponent,
        AccessControlClientComponent,
        AccessControlClientCreateComponent
    ],
    exports: [
        AccessControlClientComponent,
        AccessControlMenuComponent,
        AccessControlClientCreateComponent
    ],
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule
    ]
})
export class AccessControlModule {

}