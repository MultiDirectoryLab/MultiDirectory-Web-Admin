import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaService } from '@services/schema/schema.service';
import { MultidirectoryUiKitModule } from '../../../../../../../multidirectory-ui-kit/src/lib/multidirectory-ui-kit.module';
import { TableColumn } from 'ngx-datatable-gimefork';
import { translate } from '@jsverse/transloco';
import { DialogService } from '@components/modals/services/dialog.service';
import {
  EntityDetailsDialogData,
  EntityDetailsDialogReturnData,
} from './entities-details-dialog/entities-details-dialog.interface';
import { EntitiesDetailsDialogComponent } from './entities-details-dialog/entities-details-dialog.component';

@Component({
  imports: [CommonModule, MultidirectoryUiKitModule],
  templateUrl: './entities-browser.component.html',
  styleUrl: './entities-browser.component.scss',
})
export class EntitiesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  private dialog = inject(DialogService);

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

  showEntityDialog(event: InputEvent) {
    const entity = (event as never as { row: SchemaEntity }).row;
    this.dialog.open<
      EntityDetailsDialogReturnData,
      EntityDetailsDialogData,
      EntitiesDetailsDialogComponent
    >({
      component: EntitiesDetailsDialogComponent,
      dialogConfig: {
        height: '560px',
        data: { entity: entity },
      },
    });
  }
}
