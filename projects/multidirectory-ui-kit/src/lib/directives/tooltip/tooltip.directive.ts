import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Directive, OnDestroy, ElementRef, HostListener, input, booleanAttribute, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipPanelComponent } from '../../components/tooltip-panel/tooltip-panel.component';

const ALLOW_TOOLTIP_AGAIN_DELAY = 3000;

@Directive({
  selector: '[mdTooltip]',
})
export class TooltipDirective implements OnDestroy {
  private _overlayRef?: OverlayRef;
  private _hiddenByClick: boolean = false;
  private _elementRef: ElementRef = inject(ElementRef);
  private _overlay: Overlay = inject(Overlay);
  private _domSanitizer: DomSanitizer = inject(DomSanitizer);

  tooltipText = input<string | undefined>();
  hasHtmlContent = input(false, { transform: booleanAttribute });
  extended = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });

  ngOnDestroy(): void {
    if (this._overlayRef === undefined) {
      return;
    }

    if (this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }

    this._overlayRef.dispose();
  }

  @HostListener('mouseover')
  onMouseOver() {
    if (!this.tooltipText() || this.disabled() || this._hiddenByClick) {
      return;
    }

    if (this._overlayRef === undefined) {
      this._createOverlay();
      return;
    }

    this._overlayRef.updatePosition();

    if (this._overlayRef!.hasAttached()) {
      return;
    }

    this._createComponentPortal();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this._overlayRef?.hasAttached()) {
      this._overlayRef.detach();
    }

    if (this._hiddenByClick) {
      setTimeout(() => {
        this._hiddenByClick = false;
      }, ALLOW_TOOLTIP_AGAIN_DELAY);
    }
  }

  @HostListener('click')
  onClick() {
    if (this._overlayRef?.hasAttached()) {
      this._overlayRef.detach();

      this._hiddenByClick = true;
    }
  }

  private _createOverlay() {
    this._overlayRef = this._overlay.create({
      hasBackdrop: false,
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ])
        .withDefaultOffsetX(10)
        .withDefaultOffsetY(10)
        .withViewportMargin(10)
        .withGrowAfterOpen(true),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });

    this._createComponentPortal();
  }

  private _createComponentPortal() {
    const portal = new ComponentPortal(TooltipPanelComponent);
    const componentRef = this._overlayRef!.attach(portal);

    const value = this.hasHtmlContent() ? this._domSanitizer.bypassSecurityTrustHtml(this.tooltipText()!) : this.tooltipText()!;

    componentRef.setInput('value', value);
    componentRef.setInput('extended', this.extended());
  }
}
