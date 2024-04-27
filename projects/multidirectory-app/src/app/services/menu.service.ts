import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private _accessControlMenu = new Subject<void>();
  get accessControlMenuRx() {
    return this._accessControlMenu.asObservable();
  }
  showAccessControlMenu() {
    this._accessControlMenu.next();
  }
}
