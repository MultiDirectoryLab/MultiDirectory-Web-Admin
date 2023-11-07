import { NgModule } from "@angular/core";
import { AttributeListComponent } from "./attributes-list/attributes-list.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { TranslocoModule } from "@ngneat/transloco";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ValidatorsModule,
        TranslocoModule,
        MultidirectoryUiKitModule
    ],
    declarations: [ AttributeListComponent, ChangePasswordComponent ],
    exports: [AttributeListComponent, ChangePasswordComponent]
})
export class EditorsModule {}