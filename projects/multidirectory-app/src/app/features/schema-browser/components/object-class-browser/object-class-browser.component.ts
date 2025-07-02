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
import { EMPTY, of, switchMap, take } from 'rxjs';
import { m } from 'node_modules/@angular/cdk/overlay-module.d-C2CxnwqT';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from '@services/app-settings.service';

@Component({
  selector: 'app-object-class-browser',
  imports: [CommonModule, MultidirectoryUiKitModule, TranslocoModule, FormsModule],
  templateUrl: './object-class-browser.component.html',
  styleUrl: './object-class-browser.component.scss',
})
export class ObjectClassBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  private dialog = inject(DialogService);
  private settings = inject(AppSettingsService);

  private _query: string = '';
  get query(): string {
    return this._query;
  }
  set query(query: string) {
    this._query = query;
    this._offset = 0;
    this.loadData();
  }
  objectClasses = signal<SchemaObjectClass[]>([]);
  columns = signal<TableColumn[]>([
    { name: translate('object-class-browser.name-column'), prop: 'name' },
  ]);
  attributeName = '';
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
    this.settings.headerTitle = translate('object-class-browser.header');
    this.loadData();
  }

  loadData() {
    this.schema.getObjectClasses(this.offset, this.limit, this.query).subscribe((result) => {
      this.total = result.metadata.total_count;
      this.objectClasses.set(result.items);
    });
  }

  openCreateObjectClassDialog() {
    this.dialog
      .open<
        ObjectClassCreateDialogReturnData,
        ObjectClassCreateDialogData,
        ObjectClassCreateDialogComponent
      >({
        component: ObjectClassCreateDialogComponent,
        dialogConfig: {
          data: {
            objectClass: new SchemaObjectClass({
              name: '',
              oid: '',
              is_system: false,
              syntax: '',
            }),
          },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return EMPTY;
          }
          return this.schema.createObjectClass(result);
        }),
      )
      .subscribe((result) => {});
  }

  onPropertiesClick(event: InputEvent) {
    const objectClass = (event as any).row as SchemaObjectClass;
    this.openObjectClassProperties(objectClass.name);
  }

  openObjectClassPropertiesDialog(objectClass: SchemaObjectClass) {
    return this.dialog.open<
      ObjectClassPropertiesDialogReturnData,
      ObjectClassPropertiesDialogData,
      ObjectClassPropertiesDialogComponent
    >({
      component: ObjectClassPropertiesDialogComponent,
      dialogConfig: {
        data: { objectClass: objectClass },
        width: '612px',
      },
    });
  }

  openObjectClassProperties(objectClassName: string) {
    this.schema
      .getObjectClass(objectClassName)
      .pipe(
        switchMap((objectClass) => {
          return this.openObjectClassPropertiesDialog(objectClass).closed;
        }),
        switchMap((result) => {
          if (!!result) {
            return this.schema.updateObjectClass(result);
          }
          return of(result);
        }),
      )
      .subscribe((result) => {});
  }
}
