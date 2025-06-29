import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaService } from '@services/schema/schema.service';
import { MultidirectoryUiKitModule } from '../../../../../../../multidirectory-ui-kit/src/lib/multidirectory-ui-kit.module';
import { TableColumn } from 'ngx-datatable-gimefork';
import { translate } from '@jsverse/transloco';
import { DialogService } from '@components/modals/services/dialog.service';
import {
  SchemaEntityDetailsDialogData,
  SchemaEntityDetailsDialogReturnData,
} from './schema-entities-details-dialog/schema-entities-details-dialog.interface';
import { EntitiesDetailsDialogComponent } from './schema-entities-details-dialog/schema-entities-details-dialog.component';
import { DropdownOption } from 'multidirectory-ui-kit';
import { AppSettingsService } from '@services/app-settings.service';

@Component({
  imports: [CommonModule, MultidirectoryUiKitModule],
  templateUrl: './schema-entities-browser.component.html',
  styleUrl: './schema-entities-browser.component.scss',
})
export class SchemaEntitiesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  private dialog = inject(DialogService);
  private settings = inject(AppSettingsService);

  entites = signal<SchemaEntity[]>([]);
  columns = signal<TableColumn[]>([
    { name: translate('schema-entities-browser.column-name'), prop: 'name' },
    { name: translate('schema-entities-browser.column-type'), prop: 'type' },
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
    this.settings.headerTitle = translate('schema-entities-browser.header');
    this.loadData();
  }

  loadData() {
    this.schema.getEntities(this.offset, this.limit).subscribe((result) => {
      this.total = result.metadata.total_count;
      this.entites.set(result.items);
    });
  }

  showEntityDialog(event: InputEvent) {
    const entity = (event as never as { row: SchemaEntity }).row;
    this.dialog.open<
      SchemaEntityDetailsDialogReturnData,
      SchemaEntityDetailsDialogData,
      EntitiesDetailsDialogComponent
    >({
      component: EntitiesDetailsDialogComponent,
      dialogConfig: {
        data: { entity: entity },
      },
    });
  }
}
