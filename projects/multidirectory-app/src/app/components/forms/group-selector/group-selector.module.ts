import { NgModule } from "@angular/core";
import { GroupSelectorComponent } from "./group-selector.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../validators/validators.module";
import { EntityTypeSelectorModule } from "../entity-type-selector/entity-type-selector.module";

@NgModule({
    declarations: [GroupSelectorComponent],
    exports: [GroupSelectorComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MultidirectoryUiKitModule,
        ValidatorsModule,
        EntityTypeSelectorModule
    ]
})
export class GroupSelectorModule {}