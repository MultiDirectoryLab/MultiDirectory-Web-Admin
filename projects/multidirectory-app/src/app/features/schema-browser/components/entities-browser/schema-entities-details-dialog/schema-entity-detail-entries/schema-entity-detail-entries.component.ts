import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaEntry } from '@models/api/entity-attribute/schema-entry';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { TableColumn } from 'ngx-datatable-gimefork';
import {
  DatagridComponent,
  DropdownOption,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { from, switchMap, take, zip } from 'rxjs';

@Component({
  selector: 'app-schema-entity-detail-entries',
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './schema-entity-detail-entries.component.html',
  styleUrl: './schema-entity-detail-entries.component.scss',
})
export class SchemaEntityDetailEntriesComponent implements OnInit {
  private readonly api = inject(MultidirectoryApiService);
  private readonly ldapTreeview = inject(LdapTreeviewService);
  private readonly grid = viewChild.required<DatagridComponent>('grid');

  entity = input<SchemaEntity>(new SchemaEntity({}));
  entries = signal<SchemaEntry[]>([]);
  columns = signal<TableColumn[]>([{ name: 'name' }]);

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
    from(this.ldapTreeview.load(''))
      .pipe(
        switchMap((node) => {
          return this.api.search(
            SearchQueries.getSchemaEntityEntries(
              node[0].id,
              this.entity().name,
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
