import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { TextboxComponent } from './components/textbox/textbox.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NumberComponent } from './components/number/number.component';


@NgModule({
  declarations: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent
  ],
  imports: [
  ],
  exports: [
    ButtonComponent,
    TextboxComponent,
    DropdownComponent,
    NumberComponent
  ]
})
export class MultifactorUiModule { }
