import { Injectable } from '@angular/core';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { Observable, map, of, switchMap, tap, zip } from 'rxjs';
import { EntityAttribute } from '@features/ldap-entry-properties/entity-attributes/entity-attributes.component';

interface SchemaSearchResult {
  search_result?: Array<{
    partial_attributes: Array<{
      type: string;
      vals: string[];
    }>;
  }>;
}

interface PropertiesSearchResult {
  search_result: Array<{
    object_name: string;
    partial_attributes: Array<{
      type: string;
      vals: string[];
    }>;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class LdapPropertiesService {
  private readonly READONLY_ATTRIBUTES = ['distinguishedName'] as const;

  constructor(private api: MultidirectoryApiService) {}

  loadData(entityId: string, oldValues?: EntityAttribute[]): Observable<EntityAttribute[]> {
    return zip(this.loadSchema(), this.loadEntityProperties(entityId)).pipe(
      tap(([_, values]) => this.updateOldValues(oldValues, values)),
      map(([attributes, values]) => this.mergeAttributesAndValues(attributes, values)),
    );
  }

  loadSchema(): Observable<EntityAttribute[]> {
    return this.api.search(SearchQueries.getSchema()).pipe(
      map((schema: SchemaSearchResult) => {
        const types = this.extractAttributeTypes(schema);
        if (!types) {
          return [];
        }
        return this.parseSchemaTypes(types);
      }),
    );
  }

  loadEntityProperties(entityId: string): Observable<EntityAttribute[]> {
    return this.api.search(SearchQueries.getProperites(entityId)).pipe(
      map((response: PropertiesSearchResult) => {
        const result =
          response.search_result.find((x) => x.object_name === entityId) ??
          response.search_result[0];

        return result.partial_attributes.map((attr) => {
          const isWritable = !this.READONLY_ATTRIBUTES.includes(attr.type as any);
          return new EntityAttribute(attr.type, attr.vals.join(';'), false, isWritable);
        });
      }),
    );
  }

  private extractAttributeTypes(schema: SchemaSearchResult): string[] | undefined {
    return schema.search_result?.[0]?.partial_attributes.find((x) => x.type === 'attributeTypes')
      ?.vals;
  }

  private parseSchemaTypes(types: string[]): EntityAttribute[] {
    const attributes: EntityAttribute[] = [];
    const nameRegex = /NAME \'([A-Za-z]+)\'/gi;

    for (const type of types) {
      const nameMatch = nameRegex.exec(type);
      if (!nameMatch?.[1]) continue;

      const attributeName = nameMatch[1];
      const isWritable = !this.READONLY_ATTRIBUTES.includes(attributeName as any);
      attributes.push(new EntityAttribute(attributeName, '', false, isWritable));
    }

    return attributes;
  }

  private updateOldValues(
    oldValues: EntityAttribute[] | undefined,
    values: EntityAttribute[],
  ): void {
    if (!oldValues) return;

    oldValues.forEach((oldValue) => {
      if (!oldValue.changed) return;

      if (Array.isArray(oldValue.val)) {
        oldValue.val = oldValue.val.join(';');
      }

      const matchingValues = values.filter((x) => x.name === oldValue.name);
      if (!matchingValues.length) {
        values.push(oldValue);
        return;
      }

      const newVal =
        matchingValues.length > 1
          ? matchingValues.map((x) => x.val).join(';')
          : matchingValues[0].val;

      oldValue.val = newVal;
      oldValue.changed = true;
      oldValue.writable = !this.READONLY_ATTRIBUTES.includes(oldValue.name as any);
    });
  }

  private mergeAttributesAndValues(
    attributes: EntityAttribute[],
    values: EntityAttribute[],
  ): EntityAttribute[] {
    if (!attributes) {
      attributes = [];
    }

    for (const val of values) {
      const index = attributes.findIndex((x) => x.name === val.name);
      const multipleValues = val.val.split(';');

      if (!multipleValues.length) continue;

      const newAttributes = multipleValues.map(
        (value) => new EntityAttribute(val.name, value, val.changed, val.writable),
      );

      if (index >= 0) {
        attributes[index].val = newAttributes[0].val;
        attributes[index].changed = newAttributes[0].changed;
        attributes.splice(index, 0, ...newAttributes.slice(1));
      } else {
        attributes = attributes.concat(newAttributes);
      }
    }

    return attributes;
  }
}
