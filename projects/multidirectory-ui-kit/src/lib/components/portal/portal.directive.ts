import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { MdPortalService } from './portal.service';

@Directive({
  selector: '[mdPortal]',
  exportAs: 'mdPortal',
})
export class MdPortalDirective implements AfterViewInit, OnDestroy {
  @Input('mdPortal') portalKey = 'portal';

  constructor(
    private viewContainerRef: ViewContainerRef,
    private portalService: MdPortalService,
  ) {}
  ngAfterViewInit(): void {
    if (!this.portalKey) {
      throw 'Wrong Portal Key';
    }
    this.portalService.push(this.portalKey, this.viewContainerRef);
  }

  ngOnDestroy(): void {
    this.portalService.pop(this.portalKey, this.viewContainerRef);
  }
}
