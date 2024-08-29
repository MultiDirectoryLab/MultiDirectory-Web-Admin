import { Observable } from 'rxjs';
import { BulkCompleteStrategy } from './bulk-complete-strategy';
import { BulkPerformStrategy } from './bulk-perfrom-strategy';

export class Bulk<T> {
  private _entires: T[] = [];
  constructor(entries: T[]) {
    this._entires = entries;
  }

  mutate<V>(bulk_perform_strategy: BulkPerformStrategy<T>): Bulk<V> {
    const new_entires = this._entires.map((x) => bulk_perform_strategy.mutate<V>(x));
    return new Bulk<V>(new_entires);
  }

  complete<RESULT>(bulk_complete_strategy: BulkCompleteStrategy<T>): Observable<RESULT> {
    return bulk_complete_strategy.complete<RESULT>(this._entires);
  }
}
