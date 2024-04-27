import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessPolicyCreateComponent } from './access-policy-create/access-policy-create.component';
import { AccessPolicySettingsComponent } from './access-policy-list.component';
import { AccessPolicyComponent } from './access-policy/access-policy.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AccessPolicyIpListComponent } from './access-policy-ip-list/access-policy-ip-list.component';
import { TranslocoModule } from '@ngneat/transloco';
import { AccessPolicyViewComponent } from './access-policy-view/access-policy-view.component';
import { AccessPolicyRoutingModule } from './access-policy-routing.module';
import { AccessPolicyHeaderComponent } from './access-policy-header/access-policy-header.component';
import { ValidatorsModule } from '@core/validators/validators.module';
import { GroupSelectorModule } from '@features/forms/group-selector/group-selector.module';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@NgModule({
  declarations: [
    AccessPolicySettingsComponent,
    AccessPolicyComponent,
    AccessPolicyCreateComponent,
    AccessPolicyIpListComponent,
    AccessPolicyViewComponent,
    AccessPolicyHeaderComponent,
  ],
  exports: [
    AccessPolicySettingsComponent,
    AccessPolicyComponent,
    AccessPolicyCreateComponent,
    AccessPolicyIpListComponent,
    AccessPolicyViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MultidirectoryUiKitModule,
    ValidatorsModule,
    GroupSelectorModule,
    DragDropModule,
    TranslocoModule,
    AccessPolicyRoutingModule,
  ],
})
export class AccessPolicyModule {}
