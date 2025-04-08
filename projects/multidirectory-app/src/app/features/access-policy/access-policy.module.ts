import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidatorsModule } from '@core/validators/validators.module';
import { EntitySelectorModule } from '@features/forms/entity-selector/entity-selector.module';
import { TranslocoModule } from '@jsverse/transloco';
import { AccessPolicyHeaderComponent } from './access-policy-header/access-policy-header.component';
import { AccessPolicyIpListComponent } from './access-policy-ip-list/access-policy-ip-list.component';
import { AccessPolicySettingsComponent } from './access-policy-list.component';
import { AccessPolicyViewModalComponent } from './access-policy-view-modal/access-policy-view-modal.component';
import { AccessPolicyViewComponent } from './access-policy-view/access-policy-view.component';
import { AccessPolicyComponent } from './access-policy/access-policy.component';

@NgModule({
  exports: [
    AccessPolicySettingsComponent,
    AccessPolicyComponent,
    AccessPolicyViewModalComponent,
    AccessPolicyIpListComponent,
    AccessPolicyViewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ValidatorsModule,
    EntitySelectorModule,
    DragDropModule,
    TranslocoModule,
    AccessPolicySettingsComponent,
    AccessPolicyComponent,
    AccessPolicyIpListComponent,
    AccessPolicyViewComponent,
    AccessPolicyViewModalComponent,
    AccessPolicyHeaderComponent,
  ],
})
export class AccessPolicyModule {}
