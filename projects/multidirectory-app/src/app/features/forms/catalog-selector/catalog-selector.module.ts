import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogSelectorComponent } from './catalog-selector.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ValidatorsModule } from '@core/validators/validators.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorsModule,
    TranslocoModule,
    MultidirectoryUiKitModule,
  ],
  exports: [CatalogSelectorComponent],
  declarations: [CatalogSelectorComponent],
})
export class CatalogSelectorModule {}
