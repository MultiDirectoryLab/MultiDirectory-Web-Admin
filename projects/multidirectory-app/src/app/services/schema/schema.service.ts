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

  getEntities(offset: number, pageSize: number, query: string): Observable<SchemaEntitiesResponse> {
    return this.api.getSchemaEntities(Math.floor(offset / pageSize) + 1, pageSize, query);
  }

  getSchemaEntity(entityName: string) {
    return this.api.getSchemaEntity(entityName);
  }

  getObjectClasses(
    offset: number,
    pageSize: number,
    query: string,
  ): Observable<SchemaObjectClassResponse> {
    return this.api.getSchemaObjectClasses(Math.floor(offset / pageSize) + 1, pageSize, query);
  }

  getAttributes(
    offset: number,
    pageSize: number,
    query: string,
  ): Observable<SchemaAttributeTypesResponse> {
    return this.api.getSchemaAttributes(Math.floor(offset / pageSize) + 1, pageSize, query);
  }

  createAttribute(attribute: SchemaAttributeType) {
    return this.api.createSchemaAttribute(attribute);
  }

  updateAttribute(attibute: SchemaAttributeType) {
    return this.api.updateSchemaAttribute(attibute);
  }

  getAttribute(attributeName: string): Observable<SchemaAttributeType> {
    return this.api.getSchemaAttribute(attributeName);
  }

  updateEntity(entity: SchemaEntity): Observable<string> {
    return this.api.updateSchemaEntity(entity);
  }

  createObjectClass(objectClass: SchemaObjectClass): Observable<string> {
    return this.api.createObjectClass(objectClass);
  }

  updateObjectClass(objectClass: SchemaObjectClass): Observable<string> {
    return this.api.updateObjectClass(objectClass);
  }

  getObjectClass(objectClassName: string): Observable<SchemaObjectClass> {
    return this.api.getSchemaObjectClass(objectClassName);
  }
}
