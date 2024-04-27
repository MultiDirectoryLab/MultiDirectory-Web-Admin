import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ModalService {
  private _resizeRx = new Subject<void>();
  get resizeRx(): Observable<void> {
    return this._resizeRx.asObservable();
  }
  resize() {
    this._resizeRx.next();
  }
}
