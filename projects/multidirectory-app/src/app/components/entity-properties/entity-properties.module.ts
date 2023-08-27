import { NgModule } from "@angular/core";
import { EntityPropertiesComponent } from "./entity-properties.component";
import { EntityAttributesComponent } from "./entity-attributes/entity-attributes.component";
import { CommonModule } from "@angular/common";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule
    ],
    declarations: [
        EntityPropertiesComponent,
        EntityAttributesComponent
    ],
    exports: [
        EntityPropertiesComponent,
        EntityAttributesComponent,
    ]
})
export class EntityPropertiesModule {}