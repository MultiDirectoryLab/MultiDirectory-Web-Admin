import { Injectable } from '@angular/core';
import { MdModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class MdModalService {
  private _modals: MdModalComponent[] = [];

  push(modal: MdModalComponent) {
    this._modals.push(modal);
  }
  pop(): MdModalComponent | undefined {
    return this._modals.pop();
  }

  getModalParent(): MdModalComponent | undefined {
    if (this._modals.length <= 0) {
      return undefined;
    }
    return this._modals[this._modals.length - 1];
  }

  getModalCount(): number {
    return this._modals.length;
  }

  focusLastModal(): void {
    if (this._modals.length == 0) {
      return;
    }
    const modal = this._modals[this._modals.length - 1];
    modal.focus();
    modal.moveOnTop();
  }
}
