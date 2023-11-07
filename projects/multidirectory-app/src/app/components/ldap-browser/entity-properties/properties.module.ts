import { NgModule } from "@angular/core";
import { EntityPropertiesComponent as PropertiesComponent } from "./properties.component";
import { UserPropertiesComponent } from "./user-properties/user-properties.component";
import { CommonModule } from "@angular/common";
import { EntityAttributesComponent } from "./entity-attributes/entity-attributes.component";
import { UserPropertiesGeneralComponent } from "./user-properties/general/user-properties-general.component";
import { UserPropertiesAddressComponent } from "./user-properties/address/user-properties-address.component";
import { UserPropertiesProfileComponent } from "./user-properties/profile/user-properties-profile.component";
import { UserPropertiesAccountComponent } from "./user-properties/account/user-properties-account.component";
import { FormsModule } from "@angular/forms";
import { EditorsModule } from "../editors/editors.module";
import { MemberOfComponent } from "./member-of/member-of.component";
import { GroupSelectorModule } from "../../forms/group-selector/group-selector.module";
import { AvatarUploadComponent } from "./avatar-upload/avatar-upload.component";
import { LogonTimeEditorComponent } from "./user-properties/account/logn-time-editor/logon-time-editor.component";
import { TranslocoModule } from "@ngneat/transloco";
import { GroupPropertiesComponent } from "./group-properties/group-properties.component";
import { MembersComponent } from "./members/members.component";
import { MultidirectoryUiKitModule } from "multidirectory-ui-kit";

@NgModule({
    imports: [
        CommonModule,
        MultidirectoryUiKitModule,
        FormsModule,
        EditorsModule,
        GroupSelectorModule,
        TranslocoModule
    ],
    declarations: [
        PropertiesComponent,
        UserPropertiesComponent,
        UserPropertiesGeneralComponent,
        UserPropertiesAddressComponent,
        UserPropertiesProfileComponent,
        UserPropertiesAccountComponent,
        EntityAttributesComponent,
        MemberOfComponent,
        AvatarUploadComponent,
        LogonTimeEditorComponent,
        GroupPropertiesComponent,
        MembersComponent
    ],
    exports: [
        PropertiesComponent,
        UserPropertiesComponent,
        UserPropertiesGeneralComponent,
        UserPropertiesAddressComponent,
        UserPropertiesProfileComponent,
        UserPropertiesAccountComponent,
        EntityAttributesComponent,
        MemberOfComponent,
        AvatarUploadComponent,
        LogonTimeEditorComponent,
        MembersComponent
    ]
})
export class PropertiesModule {}