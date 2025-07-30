import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, output, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import {
  DatagridComponent,
  DropdownOption,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { AddAttributeDialogComponent } from '../add-attribute-dialog/add-attribute-dialog.component';

@Component({
  selector: 'app-object-class-attribute-summary',
  imports: [TranslocoModule, MultidirectoryUiKitModule, ReactiveFormsModule, CommonModule],
  templateUrl: './object-class-attribute-summary.component.html',
  styleUrl: './object-class-attribute-summary.component.scss',
})
export class ObjectClassAttributeSummaryComponent implements OnInit {
  private dialog = inject(DialogService);
  private mustGrid = viewChild.required<DatagridComponent>('mustGrid');
  private mayGrid = viewChild.required<DatagridComponent>('mayGrid');
  private _objectClass = new SchemaObjectClass({});
  formValid = output<boolean>();

  @Input() set objectClass(objectClass: SchemaObjectClass) {
    this._objectClass = objectClass;
    this.updateMustRows();
    this.updateMayRows();
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

  ngOnInit(): void {
    this.formValid.emit(true);
  }

  updateMustRows() {
    this.objectClassMustRows = this.objectClass.attribute_type_names_must.map((x) => {
      return { name: x };
    });

    this.mustTotal = this.objectClassMustRows.length;
  }

  updateMayRows() {
    this.objectClassMayRows = this.objectClass.attribute_type_names_may.map((x) => {
      return { name: x };
    });

    this.mayTotal = this.objectClassMayRows.length;
  }

  openObjectClassMayAttributeEditor() {
    this.dialog
      .open<string[], string[], AddAttributeDialogComponent>({
        component: AddAttributeDialogComponent,
        dialogConfig: {
          data: [''],
        },
      })
      .closed.subscribe((result) => {
        if (result) {
          this.objectClass.attribute_type_names_may =
            this.objectClass.attribute_type_names_may.concat(result);
          this.updateMayRows();
        }
      });
  }

  openObjectClassMustAttributeEditor() {
    this.dialog
      .open<string[], string[], AddAttributeDialogComponent>({
        component: AddAttributeDialogComponent,
        dialogConfig: {
          data: [''],
        },
      })
      .closed.subscribe((result) => {
        if (result) {
          this.objectClass.attribute_type_names_must =
            this.objectClass.attribute_type_names_must.concat(result);
          this.updateMustRows();
        }
      });
  }

  removeMayAttribute() {
    const selected = this.mayGrid().selected.map((x) => x.name);
    this.objectClass.attribute_type_names_may = this.objectClass.attribute_type_names_may.filter(
      (x) => !selected.includes(x),
    );
    this.updateMayRows();
  }

  removeMustAttribute() {
    const selected = this.mustGrid().selected.map((x) => x.name);
    this.objectClass.attribute_type_names_must = this.objectClass.attribute_type_names_must.filter(
      (x) => !selected.includes(x),
    );
    this.updateMustRows();
  }
}
