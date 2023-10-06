import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { ValidatorsModule } from "../validators/validators.module";
import { CatalogSelectorComponent } from "./catalog-selector.component";
import { TranslocoModule } from "@ngneat/transloco";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MultidirectoryUiKitModule,
        ValidatorsModule,
        TranslocoModule
    ],
    exports: [
        CatalogSelectorComponent,
    ],
    declarations: [
        CatalogSelectorComponent
    ]
})
export class CatalogSelectorModule {}