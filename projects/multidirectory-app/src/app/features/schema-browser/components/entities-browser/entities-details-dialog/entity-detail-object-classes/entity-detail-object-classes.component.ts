import { Component, computed, input, OnInit, signal } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { TableColumn } from 'ngx-datatable-gimefork';
import { SchemaEntityObjectClass } from '@models/api/schema/entities/schema-entity-object-class';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-entity-detail-object-classes',
  imports: [MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './entity-detail-object-classes.component.html',
  styleUrl: './entity-detail-object-classes.component.scss',
})
export class EntityDetailObjectClassesComponent implements OnInit {
  entity = input<SchemaEntity>(new SchemaEntity({}));

  columns = signal<TableColumn[]>([
    { name: 'entity-detail-object-classes.column-name', prop: 'name' },
  ]);

  objectClasses = computed<SchemaEntityObjectClass[]>(() => {
    return this.entity().object_class_names.map((x) => new SchemaEntityObjectClass({ name: x }));
  });

  ngOnInit(): void {}
}
