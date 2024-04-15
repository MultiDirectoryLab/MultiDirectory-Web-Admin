import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EntityTypeSelectorComponent } from "./entity-type-selector.component";
import { TranslocoModule } from "@ngneat/transloco";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../../../core/validators/validators.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule,
        TranslocoModule,
        MultidirectoryUiKitModule,
    ],
    exports: [
        EntityTypeSelectorComponent,
    ],
    declarations: [
        EntityTypeSelectorComponent
    ]
})
export class EntityTypeSelectorModule {}