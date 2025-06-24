import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaService } from '@services/schema/schema.service';
import { MultidirectoryUiKitModule } from '../../../../../../../multidirectory-ui-kit/src/lib/multidirectory-ui-kit.module';
import { TableColumn } from 'ngx-datatable-gimefork';
import { translate } from '@jsverse/transloco';

@Component({
  imports: [CommonModule, MultidirectoryUiKitModule],
  templateUrl: './entities-browser.component.html',
  styleUrl: './entities-browser.component.scss',
})
export class EntitiesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);

  entites = signal<SchemaEntity[]>([]);
  columns = signal<TableColumn[]>([
    { name: translate('schema-entities-browser.column-name'), prop: 'name' },
    { name: translate('schema-entities-browser.column-type'), prop: 'type' },
  ]);
  ngOnInit(): void {
    this.schema.getEntities().subscribe((result) => {
      this.entites.set(result);
    });
  }
}
