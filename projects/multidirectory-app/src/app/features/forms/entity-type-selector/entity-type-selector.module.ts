import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@jsverse/transloco';
import { EntityTypeSelectorComponent } from './entity-type-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorsModule,
    TranslocoModule,
    EntityTypeSelectorComponent,
  ],
  exports: [EntityTypeSelectorComponent],
})
export class EntityTypeSelectorModule {}
