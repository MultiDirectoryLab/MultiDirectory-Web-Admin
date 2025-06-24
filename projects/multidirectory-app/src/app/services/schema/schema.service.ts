import { Injectable } from '@angular/core';
import { SchemaEntity } from '@models/core/schema-browser/schema-entity';
import { Observable, of } from 'rxjs';

@Injectable()
export class SchemaService {
  get(): Observable<SchemaEntity[]> {
    return of([
      new SchemaEntity({
        name: 'test',
      }),
    ]);
  }
}
