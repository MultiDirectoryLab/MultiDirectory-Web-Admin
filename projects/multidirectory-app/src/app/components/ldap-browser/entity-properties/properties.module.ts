import { NgModule } from "@angular/core";
import { EntityPropertiesComponent as PropertiesComponent } from "./properties.component";
import { UserPropertiesComponent } from "./user-properties/user-properties.component";
import { CommonModule } from "@angular/common";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";
import { EntityAttributesComponent } from "./entity-attributes/entity-attributes.component";
import { UserPropertiesGeneralComponent } from "./user-properties/general/user-properties-general.component";
import { UserPropertiesAddressComponent } from "./user-properties/address/user-properties-address.component";
import { UserPropertiesProfileComponent } from "./user-properties/profile/user-properties-profile.component";
import { UserPropertiesAccountComponent } from "./user-properties/account/user-properties-account.component";
import { FormsModule } from "@angular/forms";
import { EditorsModule } from "../editors/editors.module";
import { MemberOfComponent } from "./member-of/member-of.component";
import { GroupSelectorModule } from "../../forms/group-selector/group-selector.module";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        EditorsModule,
        GroupSelectorModule
    ],
    declarations: [
        PropertiesComponent,
        UserPropertiesComponent,
        UserPropertiesGeneralComponent,
        UserPropertiesAddressComponent,
        UserPropertiesProfileComponent,
        UserPropertiesAccountComponent,
        EntityAttributesComponent,
        MemberOfComponent
    ],
    exports: [
        PropertiesComponent,
        UserPropertiesComponent,
        UserPropertiesGeneralComponent,
        UserPropertiesAddressComponent,
        UserPropertiesProfileComponent,
        UserPropertiesAccountComponent,
        EntityAttributesComponent,
        MemberOfComponent
    ]
})
export class PropertiesModule {}