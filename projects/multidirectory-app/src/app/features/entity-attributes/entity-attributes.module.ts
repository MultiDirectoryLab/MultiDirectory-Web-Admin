import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorsModule } from '@features/ldap-browser/components/editors/editors.module';
import { TranslocoModule } from '@jsverse/transloco';
import { EntityAttributesComponent } from './entity-attributes.component';

@NgModule({
  imports: [CommonModule, FormsModule, EditorsModule, TranslocoModule, EntityAttributesComponent],
  exports: [EntityAttributesComponent],
})
export class EntityAttributesModule {}
