import {
  AfterViewInit,
  Directive,
  inject,
  Input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { MdPortalService } from './portal.service';

@Directive({
  selector: '[mdPortal]',
  exportAs: 'mdPortal',
})
export class MdPortalDirective implements AfterViewInit, OnDestroy {
  private viewContainerRef = inject(ViewContainerRef);
  private portalService = inject(MdPortalService);

  @Input('mdPortal') portalKey = 'portal';

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
