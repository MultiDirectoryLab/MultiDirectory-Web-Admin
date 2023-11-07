import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidatorsModule } from "../validators/validators.module";
import { CatalogSelectorComponent } from "./catalog-selector.component";
import { TranslocoModule } from "@ngneat/transloco";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";

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
        CatalogSelectorComponent,
    ],
    declarations: [
        CatalogSelectorComponent
    ]
})
export class CatalogSelectorModule {}