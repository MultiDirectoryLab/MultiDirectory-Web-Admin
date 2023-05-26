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
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatagridComponent } from './components/datagrid/datagrid.component';
import { DropdownContainerDirective } from './components/dropdown-menu/dropdown-container.directive';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadiobuttonComponent, RadiogroupComponent } from './components/radiobutton/radiobutton.component';
import { StepperComponent } from './components/stepper/stepper.component';

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
    PlaneButtonComponent,
    DatagridComponent,
    DropdownContainerDirective,
    CheckboxComponent,
    RadiobuttonComponent,
    RadiogroupComponent,
    StepperComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    NgxDatatableModule 
  ],
  exports: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent,
    MdModalComponent,
    TreeviewComponent,
    DropdownMenuComponent,
    PlaneButtonComponent,
    DatagridComponent,
    DropdownContainerDirective,
    CheckboxComponent,
    RadiobuttonComponent,
    RadiogroupComponent,
    StepperComponent
  ]
})
export class MultidirectoryUiKitModule { }
