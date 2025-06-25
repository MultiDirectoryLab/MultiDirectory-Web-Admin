import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaEntry } from '@models/api/entity-attribute/schema-entry';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { single } from 'rxjs';

@Component({
  selector: 'app-entity-detail-entries',
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './entity-detail-entries.component.html',
  styleUrl: './entity-detail-entries.component.scss',
})
export class EntityDetailEntriesComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  entity = input<SchemaEntity>(new SchemaEntity({}));
  entries = signal<SchemaEntry[]>([]);
  columns = signal<TableColumn[]>([{ name: 'name' }]);
  ngOnInit(): void {
    this.api
      .search(SearchQueries.getSchemaEntityEntries(this.entity().name))
      .subscribe((result) => {
        this.entries.set(
          result.search_result.map(
            (x) =>
              new SchemaEntry({
                name: x.object_name,
              }),
          ),
        );
      });
  }
}
