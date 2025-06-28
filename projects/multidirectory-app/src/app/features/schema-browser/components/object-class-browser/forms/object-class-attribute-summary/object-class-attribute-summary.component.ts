import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, viewChild } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import {
  DatagridComponent,
  DropdownOption,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import {
  ObjectClassAttributeEditorDialogData,
  ObjectClassAttributeEditorDialogReturnData,
} from '../object-class-attribute-editor/object-class-attribute-editor.interface';
import { ObjectClassAttributeEditorComponent } from '../object-class-attribute-editor/object-class-attribute-editor.component';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { TableColumn } from 'ngx-datatable-gimefork';
import { SchemaEntityAddObjectClassDialogComponent } from '@features/schema-browser/components/entities-browser/schema-entities-details-dialog/schema-entity-add-object-class-dialog/schema-entity-add-object-class-dialog.component';
import { SchemaEntityAddObjectClassDialogReturnData } from '@features/schema-browser/components/entities-browser/schema-entities-details-dialog/schema-entity-add-object-class-dialog/schema-entity-add-object-class-dialog.interface';

@Component({
  selector: 'app-object-class-attribute-summary',
  imports: [TranslocoModule, MultidirectoryUiKitModule, CommonModule],
  templateUrl: './object-class-attribute-summary.component.html',
  styleUrl: './object-class-attribute-summary.component.scss',
})
export class ObjectClassAttributeSummaryComponent {
  private dialog = inject(DialogService);
  private mustGrid = viewChild.required<DatagridComponent>('mustGrid');
  private mayGrid = viewChild.required<DatagridComponent>('mayGrid');

  private _objectClass = new SchemaObjectClass({});
  @Input() set objectClass(objectClass: SchemaObjectClass) {
    this._objectClass = objectClass;
    this.objectClassMustRows = objectClass.attribute_type_names_must.map((x) => {
      return { name: x };
    });
    this.objectClassMayRows = objectClass.attribute_type_names_may.map((x) => {
      return { name: x };
    });
    this.mustTotal = this.objectClassMustRows.length;
    this.mayTotal = this.objectClassMayRows.length;
  }
  get objectClass() {
    return this._objectClass;
  }

  mustPageSizes = [new DropdownOption({ title: '15', value: 15 })];
  mustOffset = 0;
  mustTotal = 0;
  mustLimit = 15;
  mustColumns: TableColumn[] = [
    { prop: 'name', name: translate('object-class-attribute-summary.column-must') },
  ];
  mayColumns: TableColumn[] = [
    { prop: 'name', name: translate('object-class-attribute-summary.column-may') },
  ];

  mayPageSizes = [new DropdownOption({ title: '15', value: 15 })];
  mayOffset = 0;
  mayTotal = 0;
  mayLimit = 15;
  objectClassMustRows: { name: string }[] = [];
  objectClassMayRows: { name: string }[] = [];

  openObjectClassMayAttributeEditor() {
    this.dialog
      .open<string, string, SchemaEntityAddObjectClassDialogComponent>({
        component: SchemaEntityAddObjectClassDialogComponent,
        dialogConfig: {
          data: '',
        },
      })
      .closed.subscribe((result) => {
        if (result) {
          this.objectClass.attribute_type_names_may.push(result);
          this.objectClass = this.objectClass;
        }
      });
  }

  openObjectClassMustAttributeEditor() {
    this.dialog
      .open<string, string, SchemaEntityAddObjectClassDialogComponent>({
        component: SchemaEntityAddObjectClassDialogComponent,
        dialogConfig: {
          data: '',
        },
      })
      .closed.subscribe((result) => {
        if (result) {
          this.objectClass.attribute_type_names_must.push(result);
          this.objectClass = this.objectClass;
        }
      });
  }

  removeMayAttribute() {
    const selected = this.mayGrid().selected;
    this.objectClass.attribute_type_names_may.filter((x) => !selected.includes(x));
    this.objectClass = this.objectClass;
  }
  removeMustAttribute() {
    const selected = this.mustGrid().selected;
    this.objectClass.attribute_type_names_must.filter((x) => !selected.includes(x));
    this.objectClass = this.objectClass;
  }
}
