import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@jsverse/transloco';
import { PasswordConditionsComponent } from './password-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    TranslocoModule,
    PasswordConditionsComponent,
  ],
  exports: [PasswordConditionsComponent],
})
export class PasswordConditionsModule {}
