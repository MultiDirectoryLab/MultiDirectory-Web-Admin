import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, viewChild } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaEntry } from '@models/api/entity-attribute/schema-entry';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { TableColumn } from 'ngx-datatable-gimefork';
import { DatagridComponent, DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { from, switchMap, zip, take } from 'rxjs';
import { SchemaService } from '@services/schema/schema.service';
import { AttributeListEntry } from '@components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';
import { SearchEntry } from '@models/api/entry/search-entry';

@Component({
  selector: 'app-object-class-entities',
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './object-class-entities.component.html',
})
export class ObjectClassEntitiesComponent {
  private readonly api = inject(MultidirectoryApiService);
  private readonly ldapTreeview = inject(LdapTreeviewService);
  tree: AttributeListEntry[] = [];

  objectClass = input<SchemaObjectClass>();
  columns = signal<TableColumn[]>([{ name: translate('name'), prop: 'name' }]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (!this.objectClass()?.name) {
      return;
    }
    from(this.ldapTreeview.load(''))
      .pipe(
        switchMap((node) => {
          return this.api.search(SearchQueries.getSchemaObjectClassEntries(node[0].id, this.objectClass()!.name, 0, 100));
        }),
      )
      .subscribe((result) => {
        const values = this.findUniqueSimilarKrb(result.search_result);
        this.tree = values.map(
          (x) =>
            new AttributeListEntry({
              name: x,
              id: x,
              selectable: true,
              type: '',
              new: false,
            }),
        );
      });
  }

  findUniqueSimilarKrb(arr: SearchEntry[]): string[] {
    const uniqueValues = new Set<string>();

    for (const item of arr) {
      const name = item.partial_attributes.find((el) => el.type === 'entityTypeName')?.vals[0];
      name && uniqueValues.add(name);
    }

    return Array.from(uniqueValues);
  }
}
