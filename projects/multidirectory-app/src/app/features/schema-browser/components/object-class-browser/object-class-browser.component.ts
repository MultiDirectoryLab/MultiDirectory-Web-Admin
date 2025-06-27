import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { SchemaService } from '@services/schema/schema.service';
import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import {
  ObjectClassCreateDialogData,
  ObjectClassCreateDialogReturnData,
} from './object-class-create-dialog.interface';
import { ObjectClassCreateDialogComponent } from './object-class-create-dialog/object-class-create-dialog.component';
import {
  ObjectClassPropertiesDialogData,
  ObjectClassPropertiesDialogReturnData,
} from './object-class-properites-dialog.interface';
import { ObjectClassPropertiesDialogComponent } from './object-class-properties-dialog/object-class-properties-dialog.component';

@Component({
  selector: 'app-object-class-browser',
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule],
  templateUrl: './object-class-browser.component.html',
  styleUrl: './object-class-browser.component.scss',
})
export class ObjectClassBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  private dialog = inject(DialogService);

  objectClasses = signal<SchemaObjectClass[]>([]);
  columns = signal<TableColumn[]>([
    { name: translate('object-class-browser.name-column'), prop: 'name' },
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
    this.loadData();
  }

  loadData() {
    this.schema.getObjectClasses(this.offset, this.limit).subscribe((result) => {
      this.total = result.metadata.total_count;
      this.objectClasses.set(result.items);
    });
  }

  openCreateObjectClassDialog() {
    this.dialog.open<
      ObjectClassCreateDialogReturnData,
      ObjectClassCreateDialogData,
      ObjectClassCreateDialogComponent
    >({
      component: ObjectClassCreateDialogComponent,
      dialogConfig: {
        data: {},
      },
    });
  }

  openObjectClassPropertiesDialog($event: InputEvent) {
    this.dialog.open<
      ObjectClassPropertiesDialogReturnData,
      ObjectClassPropertiesDialogData,
      ObjectClassPropertiesDialogComponent
    >({
      component: ObjectClassPropertiesDialogComponent,
      dialogConfig: {
        data: {},
      },
    });
  }
}
