import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { SpinnerHostDirective } from './spinner-host.directive';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [CommonModule, NgxSpinnerModule],
  declarations: [SpinnerComponent, SpinnerHostDirective],
  exports: [SpinnerComponent, SpinnerHostDirective],
})
export class MdSpinnerModule {}
