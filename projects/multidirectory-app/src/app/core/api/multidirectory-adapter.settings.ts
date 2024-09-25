import { Injectable } from '@angular/core';
import { environment } from 'projects/multidirectory-app/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MultidirectoryAdapterSettings {
  baseUrl = environment.multidirectoryApiUrl;

  constructor() {
    if (!this.baseUrl.startsWith('http://') && !this.baseUrl.startsWith('https://')) {
      this.baseUrl = 'http://' + this.baseUrl;
    }
  }
}
