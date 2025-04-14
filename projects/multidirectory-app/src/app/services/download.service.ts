import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private _downloadDictRx = new Subject<[object, string]>();
  get downlaodDictRx(): Observable<[object, string]> {
    return this._downloadDictRx.asObservable();
  }
  downloadDict(dict: object, name: string) {
    this._downloadDictRx.next([dict, name]);
  }
}
