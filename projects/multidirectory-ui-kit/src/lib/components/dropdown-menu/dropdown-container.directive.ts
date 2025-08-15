import { Directive, ElementRef, HostListener, inject, input, Input, OnInit } from '@angular/core';
import { DropdownMenuComponent } from './dropdown-menu.component';

@Directive({
  selector: '[mdDropdownContainer]',
})
export class DropdownContainerDirective implements OnInit {
  private el = inject(ElementRef);

  @Input() mdDropdownContainer!: DropdownMenuComponent;
  @Input() openMenuOnClick = true;
  @Input() mdDropdownXOffset = 0;
  @Input() mdDropdownYOffset = 0;
  calculatePosition = input<boolean>(false);

  ngOnInit() {
    if (this.mdDropdownContainer) {
      this.mdDropdownContainer.container = this;
    }
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    if (!this.openMenuOnClick) {
      return;
    }
    $event?.stopPropagation();
    this.toggleMenu();
  }

  toggleMenu(
    focus = true,
    minWidth: number | undefined = undefined,
    maxHeight: number | undefined = undefined,
  ) {
    const rectObject = this.el.nativeElement.getBoundingClientRect();

    this.mdDropdownContainer.setPosition(
      rectObject.x + this.mdDropdownXOffset,
      rectObject.y + rectObject.height + this.mdDropdownYOffset,
    );

    this.mdDropdownContainer.setMinWidth(minWidth);
    this.mdDropdownContainer.setMaxHeight(maxHeight);
    this.mdDropdownContainer.toggle(this.el, focus, this.calculatePosition());
  }

  isVisible(): boolean {
    return this.mdDropdownContainer.dropdownVisible;
  }

  focus() {
    this.mdDropdownContainer.focus();
  }
}
