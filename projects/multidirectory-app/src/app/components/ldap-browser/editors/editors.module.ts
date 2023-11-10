import { NgModule } from "@angular/core";
import { AttributeListComponent } from "./attributes-list/attributes-list.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { TranslocoModule } from "@ngneat/transloco";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { PropertyEditorComponent } from "./property-editors/property-editor.component";
import { StringPropertyEditorComponent } from "./property-editors/typed-editors/string/string-property-editor.component";
import { IntegerPropertyEditorComponent } from "./property-editors/typed-editors/integer/integer-property-editor.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ValidatorsModule,
        TranslocoModule,
        MultidirectoryUiKitModule
    ],
    declarations: [ 
        AttributeListComponent,
        ChangePasswordComponent,
        PropertyEditorComponent,
        StringPropertyEditorComponent,
        IntegerPropertyEditorComponent
    ],
    exports: [
        AttributeListComponent,
        ChangePasswordComponent,
        PropertyEditorComponent
    ]
})
export class EditorsModule {}