import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataBusService {
  private _updateGridContent = new Subject<void>();

  get onUpdateGridContent(): Observable<void> {
    return this._updateGridContent.asObservable();
  }

  emitUpdateGridContent() {
    this._updateGridContent.next();
  }
}
