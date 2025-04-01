import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessPolicyViewModalComponent } from './access-policy-view-modal/access-policy-view-modal.component';
import { AccessPolicySettingsComponent } from './access-policy-list.component';
import { AccessPolicyComponent } from './access-policy/access-policy.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AccessPolicyIpListComponent } from './access-policy-ip-list/access-policy-ip-list.component';
import { TranslocoModule } from '@jsverse/transloco';
import { AccessPolicyViewComponent } from './access-policy-view/access-policy-view.component';
import { AccessPolicyRoutingModule } from './access-policy-routing.module';
import { AccessPolicyHeaderComponent } from './access-policy-header/access-policy-header.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

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
    MultidirectoryUiKitModule,
    DragDropModule,
    TranslocoModule,
    AccessPolicyRoutingModule,
    AccessPolicySettingsComponent,
    AccessPolicyComponent,
    AccessPolicyIpListComponent,
    AccessPolicyViewComponent,
    AccessPolicyViewModalComponent,
    AccessPolicyHeaderComponent,
  ],
})
export class AccessPolicyModule {}
