import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityAttributesComponent } from './entity-attributes.component';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { AppFormsModule } from '@features/forms/forms.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@NgModule({
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    FormsModule,
    AppFormsModule,
    TranslocoModule,
    EntityAttributesComponent,
  ],
})
export class EntityAttributesModule {}
