import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { PasswordPolicyCreateComponent } from './password-policy-create/password-policy-create.component';
import { PasswordPolicyHeaderComponent } from './password-policy-header/password-policy-header.component';
import { PasswordPolicyListItemComponent } from './password-policy-list-item/password-policy-list-item.component';
import { PasswordPolicyListComponent } from './password-policy-list.component';
import { PasswordPolicyRoutingModule } from './password-policy-routing.module';
import { PasswordPolicyComponent } from './password-policy/password-policy.component';
import { ValidatorsModule } from '@core/validators/validators.module';

@NgModule({
  imports: [
    CommonModule,
    MultidirectoryUiKitModule,
    ValidatorsModule,
    FormsModule,
    TranslocoModule,
    DragDropModule,
    PasswordPolicyRoutingModule,
  ],
  declarations: [
    PasswordPolicyListComponent,
    PasswordPolicyListItemComponent,
    PasswordPolicyCreateComponent,
    PasswordPolicyComponent,
    PasswordPolicyHeaderComponent,
  ],
})
export class PasswordPolicyModule {}
