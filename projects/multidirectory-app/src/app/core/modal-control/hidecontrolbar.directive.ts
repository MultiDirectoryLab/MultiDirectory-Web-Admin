import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHideControlbar]',
})
export class HideControlBar implements AfterContentInit {
  @Input() width = '';
  constructor(private elem: ElementRef) {}

  ngAfterContentInit(): void {
    const toHide: HTMLElement[] = this.elem.nativeElement.querySelectorAll('.ui-controlbar');
    toHide.forEach((element) => {
      element.style.display = 'none';
    });

    const modals: HTMLElement[] = this.elem.nativeElement.querySelectorAll('.ng-modal');

    modals.forEach((element) => {
      element.removeAllListeners!('keydown');
    });
    const containers: HTMLElement[] = this.elem.nativeElement.querySelectorAll('.ui-modal');
    containers.forEach((element) => {
      element.style.width = this.width;
    });
  }
}
