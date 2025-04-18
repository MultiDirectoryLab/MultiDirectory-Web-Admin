import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SlideshiftDirection } from './slideshift-direction';
import { NgClass } from '@angular/common';

@Component({
  selector: 'md-slideshift',
  styleUrls: ['./slideshift.component.scss'],
  templateUrl: 'slideshift.component.html',
  imports: [NgClass],
})
export class MdSlideshiftComponent {
  @Input() showOverlay = true;
  @Input() showSlideshift = true;
  @Input() size = '30%';
  SlideshiftDirections = SlideshiftDirection;
  @Input() slideshiftDirection = SlideshiftDirection.RIGHT;
  @Output() hide = new EventEmitter<void>();

  hideSlideshift(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.showSlideshift = false;
    this.hide.emit();
  }
}
