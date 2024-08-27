import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private _downloadDictRx = new Subject<[Object, string]>();
  get downlaodDictRx(): Observable<[Object, string]> {
    return this._downloadDictRx.asObservable();
  }
  downloadDict(dict: Object, name: string) {
    this._downloadDictRx.next([dict, name]);
  }
}
