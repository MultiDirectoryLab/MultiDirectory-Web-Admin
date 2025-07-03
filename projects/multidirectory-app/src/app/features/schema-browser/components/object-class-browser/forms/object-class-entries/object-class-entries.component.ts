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
import {
  DatagridComponent,
  DropdownOption,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { from, switchMap, zip, take } from 'rxjs';

@Component({
  selector: 'app-object-class-entries',
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './object-class-entries.component.html',
  styleUrl: './object-class-entries.component.scss',
})
export class ObjectClassEntriesComponent {
  private readonly api = inject(MultidirectoryApiService);
  private readonly ldapTreeview = inject(LdapTreeviewService);
  private readonly grid = viewChild.required<DatagridComponent>('grid');

  objectClass = input<SchemaObjectClass>();
  entries = signal<SchemaEntry[]>([]);
  columns = signal<TableColumn[]>([
    { name: translate('object-class-entries.name-column'), prop: 'name' },
  ]);

  total = 0;

  private _limit = 15;
  get limit(): number {
    return this._limit;
  }
  set limit(limit: number) {
    this._limit = limit;
    this.loadData();
  }

  private _offset = 0;
  get offset(): number {
    return this._offset;
  }
  set offset(offset: number) {
    this._offset = offset;
    this.loadData();
  }
  pageSizes: DropdownOption[] = [
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];

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
          return this.api.search(
            SearchQueries.getSchemaObjectClassEntries(
              node[0].id,
              this.objectClass()!.name,
              this.offset,
              this.limit,
            ),
          );
        }),
      )
      .subscribe((result) => {
        const entries = result.search_result.map(
          (x) =>
            new SchemaEntry({
              name: x.object_name,
            }),
        );
        this.total = result.total_pages * this.limit;
        this.entries.set(entries);
      });
  }

  deleteEntry() {
    const selected = this.grid().selected.map((x) => x.name) as string[];
    const deleteQueries = selected.map((x) =>
      this.api.delete(new DeleteEntryRequest({ entry: x })),
    );

    zip(deleteQueries)
      .pipe(take(1))
      .subscribe((results) => {
        this.loadData();
      });
  }
}
