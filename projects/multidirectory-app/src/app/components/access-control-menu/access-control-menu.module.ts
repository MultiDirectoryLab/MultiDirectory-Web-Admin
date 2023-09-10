import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { AccessControlMenuComponent } from "./access-control-menu.component";
import { AccessControlClientComponent } from "./access-control-client/access-cotnrol-client.component";

@NgModule({
    declarations: [ 
        AccessControlMenuComponent,
        AccessControlClientComponent
    ],
    exports: [
        AccessControlClientComponent,
        AccessControlMenuComponent,
    ],
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule
    ]
})
export class AccessControlModule {

}