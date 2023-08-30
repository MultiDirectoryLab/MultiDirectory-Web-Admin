import { NgModule } from "@angular/core";
import { EntityPropertiesComponent as PropertiesComponent } from "./properties.component";
import { UserPropertiesComponent } from "./user-properties/user-properties.component";
import { CommonModule } from "@angular/common";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { EntityAttributesComponent } from "./entity-attributes/entity-attributes.component";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule
    ],
    declarations: [
        PropertiesComponent,
        UserPropertiesComponent,
        EntityAttributesComponent
    ],
    exports: [
        PropertiesComponent,
        UserPropertiesComponent,
        EntityAttributesComponent
    ]
})
export class PropertiesModule {}