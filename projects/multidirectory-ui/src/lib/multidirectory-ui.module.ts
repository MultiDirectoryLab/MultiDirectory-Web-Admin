import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { TextboxComponent } from './components/textbox/textbox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NumberComponent } from './components/number/number.component';
import { ModalModule } from 'ng-modal-full-resizable';
import { MdModalComponent } from './components/modal/modal.component';


@NgModule({
  declarations: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent
  ],
  imports: [
    ModalModule
  ],
  exports: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent
  ]
})
export class multidirectoryUiModule { }
