import { inject, Injectable } from '@angular/core';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private api = inject(MultidirectoryApiService);

  getEntities(): Observable<SchemaEntity[]> {
    return this.api.getSchemaEntities(1, 100).pipe(
      map((result) => {
        return result.items;
      }),
    );
  }

  getObjectClasses(): Observable<SchemaObjectClass[]> {
    return this.api.getSchemaObjectClasses(1, 100).pipe(
      map((result) => {
        return result.items;
      }),
    );
  }

  getAttributes(): Observable<SchemaAttributeType[]> {
    return this.api.getSchemaAttributes(1, 100).pipe(
      map((result) => {
        return result.items;
      }),
    );
  }
}
