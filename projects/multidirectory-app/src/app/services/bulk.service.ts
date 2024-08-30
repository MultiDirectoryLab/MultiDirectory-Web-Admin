import { Injectable } from '@angular/core';
import { Bulk } from '@core/bulk/bulk';

@Injectable({
  providedIn: 'root',
})
export class BulkService<T> {
  create(entry_list: T[]): Bulk<T> {
    return new Bulk<T>(entry_list);
  }
}
