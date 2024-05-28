import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@ngneat/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { PasswordConditionsComponent } from './password-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    TranslocoModule,
    MultidirectoryUiKitModule,
  ],
  declarations: [PasswordConditionsComponent],
  exports: [PasswordConditionsComponent],
})
export class PasswordConditionsModule {}
