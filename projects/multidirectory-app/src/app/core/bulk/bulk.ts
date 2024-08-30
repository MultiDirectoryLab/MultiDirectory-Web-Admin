import { Observable } from 'rxjs';
import { BulkCompleteStrategy } from './bulk-complete-strategy';
import { BulkPerformStrategy } from './bulk-perfrom-strategy';
import { BulkFilterStrategy } from './bulk-filter-strategy';

export class Bulk<T> {
  private _entires: T[] = [];
  constructor(entries: T[]) {
    this._entires = entries;
  }

  mutate<V>(bulk_perform_strategy: BulkPerformStrategy<T>): Bulk<V> {
    const new_entires = this._entires.map((x) => bulk_perform_strategy.mutate<V>(x));
    return new Bulk<V>(new_entires);
  }

  filter(bulk_filter_strategy: BulkFilterStrategy<T>): Bulk<T> {
    const new_entires = this._entires.filter((x) => bulk_filter_strategy.filter(x));
    return new Bulk<T>(new_entires);
  }

  complete<RESULT>(bulk_complete_strategy: BulkCompleteStrategy<T>): Observable<RESULT> {
    return bulk_complete_strategy.complete<RESULT>(this._entires);
  }
}
