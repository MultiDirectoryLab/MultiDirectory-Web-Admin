import { NgModule } from '@angular/core';
import { AttributeListComponent } from './attributes-list/attributes-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { PropertyEditorComponent } from './property-editors/property-editor.component';
import { StringPropertyEditorComponent } from './property-editors/typed-editors/string/string-property-editor.component';
import { IntegerPropertyEditorComponent } from './property-editors/typed-editors/integer/integer-property-editor.component';
import { MultivaluedStringComponent } from './property-editors/typed-editors/multivalued-string/multivalued-string.component';
import { ValidatorsModule } from '@core/validators/validators.module';
import { PasswordConditionsModule } from './change-password/password-conditions/password-conditions.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    TranslocoModule,
    MultidirectoryUiKitModule,
    PasswordConditionsModule,
  ],
  declarations: [
    AttributeListComponent,
    ChangePasswordComponent,
    PropertyEditorComponent,
    StringPropertyEditorComponent,
    IntegerPropertyEditorComponent,
    MultivaluedStringComponent,
  ],
  exports: [
    AttributeListComponent,
    ChangePasswordComponent,
    PropertyEditorComponent,
    MultivaluedStringComponent,
  ],
})
export class EditorsModule {}
