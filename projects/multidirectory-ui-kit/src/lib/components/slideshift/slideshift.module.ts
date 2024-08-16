import { NgModule } from '@angular/core';
import { MdSlideshiftComponent } from './slideshift.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [MdSlideshiftComponent],
  exports: [MdSlideshiftComponent],
})
export class MdSlideshiftModule {}
