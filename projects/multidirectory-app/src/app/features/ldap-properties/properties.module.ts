import { NgModule } from '@angular/core';
import { UserPropertiesComponent } from './user-properties/user-properties.component';
import { CommonModule } from '@angular/common';
import { EntityAttributesComponent } from '../entity-attributes/entity-attributes.component';
import { UserPropertiesGeneralComponent } from './user-properties/general/user-properties-general.component';
import { UserPropertiesAddressComponent } from './user-properties/address/user-properties-address.component';
import { UserPropertiesProfileComponent } from './user-properties/profile/user-properties-profile.component';
import { UserPropertiesAccountComponent } from './user-properties/account/user-properties-account.component';
import { FormsModule } from '@angular/forms';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { LogonTimeEditorComponent } from './user-properties/account/logn-time-editor/logon-time-editor.component';
import { TranslocoModule } from '@jsverse/transloco';
import { GroupPropertiesComponent } from './group-properties/group-properties.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

import { AppFormsModule } from '@features/forms/forms.module';
import { ComputerPropertiesComponent } from './computer-properties/computer-properties.component';
import { ComputerPropertiesAccountComponent } from './computer-properties/account/computer-properties-account.component';

@NgModule({
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    FormsModule,
    AppFormsModule,
    TranslocoModule,
    GroupPropertiesComponent,
    EntityAttributesComponent,
    ComputerPropertiesComponent,
    ComputerPropertiesAccountComponent,
    UserPropertiesComponent,
    UserPropertiesGeneralComponent,
    UserPropertiesAddressComponent,
    UserPropertiesProfileComponent,
    UserPropertiesAccountComponent,
    AvatarUploadComponent,
    LogonTimeEditorComponent,
  ],
  exports: [
    UserPropertiesComponent,
    UserPropertiesGeneralComponent,
    UserPropertiesAddressComponent,
    UserPropertiesProfileComponent,
    UserPropertiesAccountComponent,
    AvatarUploadComponent,
    LogonTimeEditorComponent,
  ],
})
export class PropertiesModule {}
