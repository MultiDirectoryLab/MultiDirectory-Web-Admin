import { NgModule } from "@angular/core";
import { EntityTypeSelectorComponent } from "./entity-type-selector/entity-type-selector.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "./validators/validators.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MultidirectoryUiKitModule,
        ValidatorsModule
    ],
    exports: [
        EntityTypeSelectorComponent,
        GroupSelectorComponent
    ],
    declarations: [
        EntityTypeSelectorComponent
    ]
})
export class AppFormsModule {}