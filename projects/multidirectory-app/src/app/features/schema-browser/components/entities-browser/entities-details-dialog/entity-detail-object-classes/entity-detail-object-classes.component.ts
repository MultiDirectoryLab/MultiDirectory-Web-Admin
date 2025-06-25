import { Component, input, signal } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { MultidirectoryUiKitModule } from '../../../../../../../../../multidirectory-ui-kit/src/lib/multidirectory-ui-kit.module';
import { DatagridComponent } from '../../../../../../../../../multidirectory-ui-kit/src/lib/components/datagrid/datagrid.component';
import { TableColumn } from 'ngx-datatable-gimefork';

@Component({
  selector: 'app-entity-detail-object-classes',
  imports: [MultidirectoryUiKitModule],
  templateUrl: './entity-detail-object-classes.component.html',
  styleUrl: './entity-detail-object-classes.component.scss',
})
export class EntityDetailObjectClassesComponent {
  entity = input<SchemaEntity>(new SchemaEntity({}));

  columns = signal<TableColumn[]>([]);
}
