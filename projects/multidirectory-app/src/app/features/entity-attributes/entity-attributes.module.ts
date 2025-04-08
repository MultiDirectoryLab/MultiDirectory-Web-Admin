import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppFormsModule } from '@features/forms/forms.module';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { TranslocoModule } from '@jsverse/transloco';
import { EntityAttributesComponent } from './entity-attributes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EditorsModule,
    AppFormsModule,
    TranslocoModule,
    EntityAttributesComponent,
  ],
  exports: [EntityAttributesComponent],
})
export class EntityAttributesModule {}
