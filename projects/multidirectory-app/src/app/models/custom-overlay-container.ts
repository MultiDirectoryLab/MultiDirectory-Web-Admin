import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CustomOverlayContainer extends OverlayContainer {
  constructor(@Inject(DOCUMENT) document: Document, @Inject(PLATFORM_ID) platformId: object) {
    super(document, platformId as any);
  }

  protected override _createContainer() {
    const appRootContainer = this._document.querySelector('app-root') satisfies HTMLElement | null;

    if (appRootContainer) {
      this._containerElement = appRootContainer;
    } else {
      super._createContainer();
    }
  }
}
