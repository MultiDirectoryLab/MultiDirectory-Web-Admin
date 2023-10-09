import { NgModule } from "@angular/core";
import { AttributeListComponent } from "./attributes-list/attributes-list.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../../forms/validators/validators.module";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        ValidatorsModule,
        TranslocoModule
    ],
    declarations: [ AttributeListComponent ],
    exports: [AttributeListComponent]
})
export class EditorsModule {}