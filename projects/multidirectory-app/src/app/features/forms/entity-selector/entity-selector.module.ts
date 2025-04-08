import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@jsverse/transloco';
import { CatalogSelectorModule } from '../catalog-selector/catalog-selector.module';
import { EntityTypeSelectorModule } from '../entity-type-selector/entity-type-selector.module';
import { EntitySelectorComponent } from './entity-selector.component';

@NgModule({
  exports: [EntitySelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorsModule,
    EntityTypeSelectorModule,
    CatalogSelectorModule,
    TranslocoModule,
    EntitySelectorComponent,
  ],
})
export class EntitySelectorModule {}
