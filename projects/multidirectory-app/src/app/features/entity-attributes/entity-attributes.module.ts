import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityAttributesComponent } from './entity-attributes.component';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { AppFormsModule } from '@features/forms/forms.module';

@NgModule({
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    FormsModule,
    EditorsModule,
    AppFormsModule,
    TranslocoModule,
  ],
  declarations: [EntityAttributesComponent],
  exports: [EntityAttributesComponent],
})
export class EntityAttributesModule {}
