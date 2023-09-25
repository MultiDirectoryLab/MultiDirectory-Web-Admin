import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { EntityTypeSelectorComponent } from "./entity-type-selector.component";
import { ValidatorsModule } from "../validators/validators.module";

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
    ],
    declarations: [
        EntityTypeSelectorComponent
    ]
})
export class EntityTypeSelectorModule {}