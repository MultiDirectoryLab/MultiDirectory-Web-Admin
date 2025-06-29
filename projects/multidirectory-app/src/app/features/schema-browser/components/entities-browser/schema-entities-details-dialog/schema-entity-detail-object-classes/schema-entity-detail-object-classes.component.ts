import { Component, computed, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { TableColumn } from 'ngx-datatable-gimefork';
import { SchemaEntityObjectClass } from '@models/api/schema/entities/schema-entity-object-class';
import { translate, TranslocoModule } from '@jsverse/transloco';
import {
  DatagridComponent,
  DropdownOption,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { SchemaService } from '@services/schema/schema.service';
import { DialogService } from '@components/modals/services/dialog.service';
import { SchemaEntityAddObjectClassDialogComponent } from '../schema-entity-add-object-class-dialog/schema-entity-add-object-class-dialog.component';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'app-schema-entity-detail-object-classes',
  imports: [MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './schema-entity-detail-object-classes.component.html',
  styleUrl: './schema-entity-detail-object-classes.component.scss',
})
export class SchemaEntityDetailObjectClassesComponent implements OnInit {
  private readonly schema = inject(SchemaService);
  private readonly dialog = inject(DialogService);
  readonly entity = input<SchemaEntity>(new SchemaEntity({}));
  readonly grid = viewChild.required<DatagridComponent>('grid');

  columns = signal<TableColumn[]>([
    { name: translate('schema-entity-details-object-classes.column-name'), prop: 'name' },
  ]);

  objectClassNameInitial: string[] = [];
  objectClassNames = signal<string[]>([]);
  objectClasses = computed<SchemaEntityObjectClass[]>(() => {
    return this.objectClassNames().map((x) => new SchemaEntityObjectClass({ name: x }));
  });

  pageSizes: DropdownOption[] = [new DropdownOption({ title: '100', value: 100 })];
  pageSize = 100;
  isChanged = false;
  ngOnInit(): void {
    this.objectClassNameInitial = this.entity().object_class_names;
    this.objectClassNames.set(this.entity().object_class_names);
  }

  deleteObjectClass() {
    const selectedObjectClasses = this.grid().selected.map((x) => x.name);
    this.objectClassNames.set(
      this.objectClassNames().filter((x) => !selectedObjectClasses.includes(x)),
    );
    this.isChanged = true;
  }

  addObjectClass() {
    this.dialog
      .open<string, string, SchemaEntityAddObjectClassDialogComponent>({
        component: SchemaEntityAddObjectClassDialogComponent,
        dialogConfig: {
          data: '',
        },
      })
      .closed.pipe(take(1))
      .subscribe((objectClassName) => {
        if (objectClassName) {
          this.objectClassNames.set(this.objectClassNames().concat([objectClassName]));
          this.isChanged = true;
        }
      });
  }

  apply() {
    this.schema
      .updateEntity(
        new SchemaEntity({
          ...this.entity(),
          object_class_names: this.objectClassNames(),
        }),
      )
      .subscribe((result) => {
        this.isChanged = false;
      });
  }
  cancel() {
    this.objectClassNames.set(this.objectClassNameInitial);
  }
}
