import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntityAttributesModule } from '@features/entity-attributes/entity-attributes.module';
import { AppFormsModule } from '@features/forms/forms.module';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { TranslocoModule } from '@jsverse/transloco';
import { EntityAttributesComponent } from '../entity-attributes/entity-attributes.component';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { ComputerPropertiesAccountComponent } from './computer-properties/account/computer-properties-account.component';
import { ComputerPropertiesComponent } from './computer-properties/computer-properties.component';
import { GroupPropertiesComponent } from './group-properties/group-properties.component';
import { MemberOfComponent } from './member-of/member-of.component';
import { MembersComponent } from './members/members.component';
import { EntityPropertiesComponent as PropertiesComponent } from './properties.component';
import { LogonTimeEditorComponent } from './user-properties/account/logn-time-editor/logon-time-editor.component';
import { UserPropertiesAccountComponent } from './user-properties/account/user-properties-account.component';
import { UserPropertiesAddressComponent } from './user-properties/address/user-properties-address.component';
import { UserPropertiesGeneralComponent } from './user-properties/general/user-properties-general.component';
import { UserPropertiesProfileComponent } from './user-properties/profile/user-properties-profile.component';
import { UserPropertiesComponent } from './user-properties/user-properties.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorsModule,
    AppFormsModule,
    TranslocoModule,
    EntityAttributesModule,
    PropertiesComponent,
    UserPropertiesComponent,
    UserPropertiesGeneralComponent,
    UserPropertiesAddressComponent,
    UserPropertiesProfileComponent,
    UserPropertiesAccountComponent,
    MemberOfComponent,
    AvatarUploadComponent,
    LogonTimeEditorComponent,
    GroupPropertiesComponent,
    MembersComponent,
    ComputerPropertiesComponent,
    ComputerPropertiesAccountComponent,
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
    MembersComponent,
  ],
})
export class PropertiesModule {}
