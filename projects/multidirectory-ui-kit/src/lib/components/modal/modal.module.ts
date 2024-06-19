import { NgModule } from '@angular/core';
import { MdModalComponent } from './modal.component';
import { ModalInjectDirective } from './modal-inject/modal-inject.directive';
import { MdSpinnerModule } from '../spinner/spinner.module';
import { MdPortalModule } from '../portal/portal.module';
import { CommonModule } from '@angular/common';
import { ResizableModule } from './ng-modal-lib/lib/resizable/resizable-module';
import { DraggableModule } from './ng-modal-lib/lib/draggable/draggable-module';

@NgModule({
  imports: [CommonModule, ResizableModule, DraggableModule, MdSpinnerModule, MdPortalModule],
  declarations: [MdModalComponent, ModalInjectDirective],
  exports: [MdModalComponent, ModalInjectDirective, MdPortalModule],
})
export class MdModalModule {}
