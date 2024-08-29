import { Observable } from 'rxjs';

export abstract class BulkCompleteStrategy<SOURCE> {
  abstract complete<RESULT>(entires: SOURCE[]): Observable<RESULT>;
}
