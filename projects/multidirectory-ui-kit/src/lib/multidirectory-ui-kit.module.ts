import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { TextboxComponent } from './components/textbox/textbox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NumberComponent } from './components/number/number.component';
import { ModalModule } from 'ng-modal-full-resizable';
import { MdModalComponent } from './components/modal/modal.component';
import { TreeviewComponent } from './components/treeview/treeview.component';
import { ModalTestComponent } from './components/modal/modaltest.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { PlaneButtonComponent } from './components/plane-button/plane-button.component';

@NgModule({
  declarations: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent,
    ModalTestComponent,
    TreeviewComponent,
    DropdownMenuComponent,
    PlaneButtonComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule
  ],
  exports: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent,
    TreeviewComponent,
    DropdownMenuComponent,
    PlaneButtonComponent
  ]
})
export class MultidirectoryUiKitModule { }
