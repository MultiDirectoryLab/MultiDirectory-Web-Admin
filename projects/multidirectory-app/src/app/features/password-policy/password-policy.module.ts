import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { TranslocoModule } from '@jsverse/transloco';
import { PasswordPolicyCreateComponent } from './password-policy-create/password-policy-create.component';
import { PasswordPolicyHeaderComponent } from './password-policy-header/password-policy-header.component';
import { PasswordPolicyListItemComponent } from './password-policy-list-item/password-policy-list-item.component';
import { PasswordPolicyListComponent } from './password-policy-list.component';
import { PasswordPolicyComponent } from './password-policy/password-policy.component';

@NgModule({
  imports: [
    CommonModule,
    ValidatorsModule,
    FormsModule,
    TranslocoModule,
    DragDropModule,
    PasswordPolicyListComponent,
    PasswordPolicyListItemComponent,
    PasswordPolicyCreateComponent,
    PasswordPolicyComponent,
    PasswordPolicyHeaderComponent,
  ],
})
export class PasswordPolicyModule {}
