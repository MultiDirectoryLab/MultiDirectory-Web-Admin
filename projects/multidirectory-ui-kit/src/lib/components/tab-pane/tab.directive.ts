import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mdTab]',
  exportAs: 'mdTab',
})
export class TabDirective {
  elRef = inject(ElementRef);

  get el(): HTMLElement {
    return this.elRef.nativeElement;
  }
}
