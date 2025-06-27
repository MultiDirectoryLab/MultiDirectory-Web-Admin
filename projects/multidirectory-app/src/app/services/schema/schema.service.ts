import { inject, Injectable } from '@angular/core';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaAttributeTypesResponse } from '@models/api/schema/attribute-types/schema-attribute-type-response';
import { SchemaEntitiesResponse } from '@models/api/schema/entities/schema-entities-response';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { SchemaObjectClassResponse } from '@models/api/schema/object-classes/schema-object-classes-response';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private api = inject(MultidirectoryApiService);

  getEntities(offset: number, pageSize: number): Observable<SchemaEntitiesResponse> {
    return this.api.getSchemaEntities(Math.floor(offset / pageSize) + 1, pageSize);
  }

  getObjectClasses(offset: number, pageSize: number): Observable<SchemaObjectClassResponse> {
    return this.api.getSchemaObjectClasses(Math.floor(offset / pageSize) + 1, pageSize);
  }

  getAttributes(offset: number, pageSize: number): Observable<SchemaAttributeTypesResponse> {
    return this.api.getSchemaAttributes(Math.floor(offset / pageSize) + 1, pageSize);
  }

  createAttribute(attribute: SchemaAttributeType) {
    return this.api.createSchemaAttribute(attribute);
  }

  updateAttribute(attibute: SchemaAttributeType) {
    return this.api.updateSchemaAttribute(attibute);
  }

  getAttribute(attributeName: string) {
    return this.api.getSchemaAttribute(attributeName);
  }

  updateEntity(entity: SchemaEntity) {
    return this.api.updateSchemaEntity(entity);
  }
}
