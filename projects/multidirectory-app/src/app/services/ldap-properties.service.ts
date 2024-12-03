import { Injectable } from '@angular/core';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';
import { Observable, map, of, switchMap, tap, zip } from 'rxjs';
import { SchemaEntry } from '@models/entity-attribute/schema-entry';
import { AttributesSearchResult } from '@models/entity-attribute/attribute-search-result';

@Injectable({
  providedIn: 'root',
})
export class LdapPropertiesService {
  private readonly READONLY_ATTRIBUTES = ['distinguishedName'] as const;

  constructor(private api: MultidirectoryApiService) {}

  loadSchema(): Observable<SchemaEntry[]> {
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

  private parseSchemaTypes(types: string[]): SchemaEntry[] {
    const attributes: SchemaEntry[] = [];

    for (const type of types) {
      const nameRegex = /NAME \'([A-Za-z]+)\'/gi;
      const nameMatch = nameRegex.exec(type);
      if (!nameMatch?.[1]) continue;
      const syntaxMatch = /SYNTAX '([\d+.]+)'/gi.exec(type);
      const attributeName = nameMatch[1];
      const isWritable = !this.READONLY_ATTRIBUTES.includes(attributeName as any);
      attributes.push(
        new SchemaEntry({
          name: attributeName,
          writable: isWritable,
          syntax: syntaxMatch?.[1] ?? '',
        }),
      );
    }

    return attributes;
  }
}
