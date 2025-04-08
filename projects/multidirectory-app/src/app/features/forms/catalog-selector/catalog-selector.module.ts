import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@jsverse/transloco';
import { CatalogSelectorComponent } from './catalog-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorsModule,
    TranslocoModule,
    CatalogSelectorComponent,
  ],
  exports: [CatalogSelectorComponent],
})
export class CatalogSelectorModule {}
