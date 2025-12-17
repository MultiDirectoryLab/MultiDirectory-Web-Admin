import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { SchemaService } from '@services/schema/schema.service';
import { DatagridComponent, DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ObjectClassCreateDialogData, ObjectClassCreateDialogReturnData } from './object-class-create-dialog.interface';
import { ObjectClassCreateDialogComponent } from './object-class-create-dialog/object-class-create-dialog.component';
import { ObjectClassPropertiesDialogData, ObjectClassPropertiesDialogReturnData } from './object-class-properites-dialog.interface';
import { ObjectClassPropertiesDialogComponent } from './object-class-properties-dialog/object-class-properties-dialog.component';
import { concat, EMPTY, of, switchMap, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from '@services/app-settings.service';
import { ConfirmDeleteDialogComponent } from '@components/modals/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDeleteDialogReturnData, ConfirmDeleteDialogData } from '@components/modals/interfaces/confirm-delete-dialog.interface';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { TableColumn } from 'ngx-datatable-gimefork';

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
  private grid = viewChild.required<DatagridComponent>('grid');
  private api = inject(MultidirectoryApiService);
  private toastr = inject(ToastrService);

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
  columns = signal<TableColumn[]>([{ name: translate('object-class-browser.name-column'), prop: 'name' }]);
  attributeName = '';
  total = 0;

  private _limit = 20;
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
      .open<ObjectClassCreateDialogReturnData, ObjectClassCreateDialogData, ObjectClassCreateDialogComponent>({
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
      .subscribe((result) => {
        this.loadData();
      });
  }

  onPropertiesClick(event: InputEvent) {
    const objectClass = (event as any).row as SchemaObjectClass;
    this.openObjectClassProperties(objectClass.name);
  }

  openObjectClassPropertiesDialog(objectClass: SchemaObjectClass) {
    return this.dialog.open<ObjectClassPropertiesDialogReturnData, ObjectClassPropertiesDialogData, ObjectClassPropertiesDialogComponent>({
      component: ObjectClassPropertiesDialogComponent,
      dialogConfig: {
        data: { objectClass: objectClass },
        width: '732px',
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
      .subscribe((result) => {
        this.loadData();
      });
  }

  deleteObjecClasses() {
    if (!this.grid().selected?.length) {
      return;
    }
    if (this.grid().selected.some((x) => x.is_system)) {
      this.toastr.error(translate('object-class-browser.unable-delete-system'));
      return;
    }
    const toDelete = this.grid().selected.map((x) => x.name);
    this.toastr.info(translate('object-class-browser.delete-warning'));
    this.dialog
      .open<ConfirmDeleteDialogReturnData, ConfirmDeleteDialogData, ConfirmDeleteDialogComponent>({
        component: ConfirmDeleteDialogComponent,
        dialogConfig: {
          width: '580px',
          data: { toDeleteDNs: toDelete },
        },
      })
      .closed.pipe(
        switchMap((isConfirmed) => {
          return isConfirmed ? this.api.deleteSchemaObjectClass(toDelete) : of(null);
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }
}
