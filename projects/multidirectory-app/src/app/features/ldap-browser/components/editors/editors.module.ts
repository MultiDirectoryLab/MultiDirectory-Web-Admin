import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@jsverse/transloco';
import { AttributeListComponent } from './attributes-list/attributes-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PasswordConditionsModule } from './change-password/password-conditions/password-conditions.module';
import { PropertyEditorComponent } from './property-editors/property-editor.component';
import { IntegerPropertyEditorComponent } from './property-editors/typed-editors/integer/integer-property-editor.component';
import { MultivaluedStringComponent } from './property-editors/typed-editors/multivalued-string/multivalued-string.component';
import { StringPropertyEditorComponent } from './property-editors/typed-editors/string/string-property-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    TranslocoModule,
    PasswordConditionsModule,
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
