import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SetupRequest } from '@models/api/setup/setup-request';

@Injectable({
  providedIn: 'root',
})
export class SetupRequestValidatorService {
  setupRequest = new SetupRequest();

  private _stepValid = new BehaviorSubject<boolean>(false);
  get onStepValid() {
    return this._stepValid.asObservable();
  }

  stepValid(valid: boolean) {
    this._stepValid.next(valid);
  }

  private _invalidateRx = new Subject<void>();
  get invalidateRx() {
    return this._invalidateRx.asObservable();
  }
  invalidate() {
    this._invalidateRx.next();
  }
}
