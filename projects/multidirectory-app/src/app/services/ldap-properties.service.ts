import { Injectable } from '@angular/core';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { Observable, map, of, switchMap, tap, zip } from 'rxjs';
import { EntityAttribute } from '@models/entity-attribute/entity-attribute';
import { AttributesSearchResult } from '@models/entity-attribute/attribute-search-result';

@Injectable({
  providedIn: 'root',
})
export class LdapPropertiesService {
  private readonly READONLY_ATTRIBUTES = ['distinguishedName'] as const;

  constructor(private api: MultidirectoryApiService) {}

  loadSchema(): Observable<EntityAttribute[]> {
    return this.api.search(SearchQueries.getSchema()).pipe(
      map((schema: AttributesSearchResult) => {
        const types = this.extractAttributeTypes(schema);
        if (!types) {
          return [];
        }
        return this.parseSchemaTypes(types);
      }),
    );
  }

  private extractAttributeTypes(schema: AttributesSearchResult): string[] | undefined {
    return schema.search_result?.[0]?.partial_attributes.find((x) => x.type === 'attributeTypes')
      ?.vals;
  }

  private parseSchemaTypes(types: string[]): EntityAttribute[] {
    const attributes: EntityAttribute[] = [];

    for (const type of types) {
      const nameRegex = /NAME \'([A-Za-z]+)\'/gi;
      const nameMatch = nameRegex.exec(type);
      if (!nameMatch?.[1]) continue;

      const attributeName = nameMatch[1];
      const isWritable = !this.READONLY_ATTRIBUTES.includes(attributeName as any);
      attributes.push(new EntityAttribute(attributeName, '', false, isWritable));
    }

    return attributes;
  }

  private mergeSchemaAndValues(
    schema: EntityAttribute[],
    values: EntityAttribute[],
  ): EntityAttribute[] {
    if (!schema) {
      schema = [];
    }

    for (const val of values) {
      const index = schema.findIndex((x) => x.name === val.name);
      const multipleValues = val.val.split(';') as string[];
      if (!multipleValues.length) continue;

      // create new attribute for each value of the attribute
      const newAttributes = multipleValues.map(
        (value) => new EntityAttribute(val.name, value, val.changed, val.writable),
      );

      // if the attibute in schema
      if (index >= 0) {
        schema[index].val = newAttributes[0].val;
        schema[index].changed = newAttributes[0].changed;
        schema.splice(index, 0, ...newAttributes.slice(1));
      } else {
        schema = schema.concat(newAttributes);
      }
    }

    return schema;
  }
}
