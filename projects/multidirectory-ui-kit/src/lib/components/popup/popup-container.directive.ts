import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { PopupBaseComponent } from './base/popup-base.component';
import { forwardRef } from 'react';

@Directive({
  selector: '[mdPopupContainer]',
  providers: [
    {
      provide: PopupContainerDirective,
      useExisting: PopupContainerDirective,
      multi: true,
    },
  ],
  exportAs: 'PopupContainerDirective',
})
export class PopupContainerDirective implements OnInit {
  @Input() mdPopupContainer!: PopupBaseComponent;
  @Input() openMenuOnClick = true;
  @Input() mdPopupXOffset = 8;
  @Input() mdPopupYOffset = -8;
  @Input() direction: 'bottom' | 'right' = 'right';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.mdPopupContainer) {
      this.mdPopupContainer.container = this;
    }
  }
  @HostListener('click', ['$event']) onClick($event: Event) {
    if (!this.openMenuOnClick) {
      return;
    }
    $event?.stopPropagation();
    this.toggleMenu();
  }

  toggleMenu(focus = true, minWidth: number | undefined = undefined) {
    const parentRect = this.el.nativeElement.offsetParent.getBoundingClientRect();
    if (this.direction == 'right') {
      this.mdPopupContainer.setPosition(
        parentRect.left +
          this.el.nativeElement.offsetLeft +
          this.el.nativeElement.offsetWidth +
          this.mdPopupXOffset,
        parentRect.top + this.el.nativeElement.offsetTop + this.mdPopupYOffset,
      );
    }
    if (this.direction == 'bottom') {
      this.mdPopupContainer.setPosition(
        parentRect.left + this.el.nativeElement.offsetLeft + this.mdPopupXOffset,
        parentRect.top +
          this.el.nativeElement.offsetTop +
          this.el.nativeElement.offsetHeight +
          this.mdPopupYOffset,
      );
    }

    this.mdPopupContainer.setMinWidth(minWidth);
    this.mdPopupContainer.toggle(this.el, focus);
  }

  isVisible(): boolean {
    return this.mdPopupContainer.popupVisible;
  }

  focus() {
    this.mdPopupContainer.focus();
  }
}
