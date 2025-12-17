import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaService } from '@services/schema/schema.service';
import { DatagridComponent, DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { AttributeDetailsDialogComponent } from './attribute-details-dialog/attribute-details-dialog.component';
import { AttributeDetailsDialogData, AttributeDetailsDialogReturnData } from './attribute-details-dialog.interface';
import { EMPTY, of, switchMap, take } from 'rxjs';
import { AppSettingsService } from '@services/app-settings.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ConfirmDeleteDialogComponent } from '@components/modals/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDeleteDialogReturnData, ConfirmDeleteDialogData } from '@components/modals/interfaces/confirm-delete-dialog.interface';
import { TableColumn } from 'ngx-datatable-gimefork';

@Component({
  selector: 'app-attributes-browser',
  imports: [CommonModule, TranslocoModule, MultidirectoryUiKitModule, FormsModule],
  templateUrl: './attributes-browser.component.html',
  styleUrl: './attributes-browser.component.scss',
})
export class AttributesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  private dialog = inject(DialogService);
  private settings = inject(AppSettingsService);
  private toastr = inject(ToastrService);
  private api = inject(MultidirectoryApiService);
  private grid = viewChild.required<DatagridComponent>('grid');
  attributeTypes = signal<SchemaAttributeType[]>([]);

  private _query = '';
  get query(): string {
    return this._query;
  }
  set query(query: string) {
    this._offset = 0;
    this._query = query;
    this.loadData();
  }

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
    this.settings.headerTitle = translate('attributes-browser.header');
    this.loadData();
  }

  loadData() {
    this.schema.getAttributes(this.offset, this.limit, this.query).subscribe((result) => {
      this.total = result.metadata.total_count;
      this.attributeTypes.set(result.items);
    });
  }

  columns = signal<TableColumn[]>([
    { name: translate('attributes-browser.column-name'), prop: 'name' },
    { name: translate('attributes-browser.column-type'), prop: 'type' },
  ]);

  openAttirbuteDetailsDialog(event: InputEvent | null) {
    const attribute = (event as never as { row: SchemaAttributeType })?.row ?? null;
    this.schema
      .getAttribute(attribute.name)
      .pipe(
        switchMap((result) => {
          return this.showAttributeDialog(result, true);
        }),
        switchMap((result) => {
          if (result) {
            return this.schema.updateAttribute(result);
          }
          return of(result);
        }),
      )
      .subscribe();
  }

  createAttirbuteDialog(event: InputEvent | null) {
    const attribute = (event as never as { row: SchemaAttributeType })?.row ?? null;
    this.showAttributeDialog(attribute, false)
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.schema.createAttribute(result);
          }
          return of(result);
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }

  openAttribute(attributeName: string) {
    this.schema
      .getAttribute(attributeName)
      .pipe(
        switchMap((attribute) => {
          if (!attribute) {
            return EMPTY;
          }
          return this.showAttributeDialog(attribute, true);
        }),
        switchMap((result) => {
          if (!result) {
            return EMPTY;
          }
          return this.schema.updateAttribute(result);
        }),
      )
      .subscribe();
  }

  private showAttributeDialog(attribute: SchemaAttributeType, isEdit: boolean) {
    return this.dialog
      .open<AttributeDetailsDialogReturnData, AttributeDetailsDialogData, AttributeDetailsDialogComponent>({
        component: AttributeDetailsDialogComponent,
        dialogConfig: {
          data: {
            attribute: attribute,
            edit: isEdit,
          },
          width: '550px',
        },
      })
      .closed.pipe(take(1));
  }

  deleteAttributes() {
    if (!this.grid().selected?.length) {
      return;
    }
    if (this.grid().selected.some((x) => x.is_system)) {
      this.toastr.error(translate('attributes-browser.unable-delete-system'));
      return;
    }
    const toDelete = this.grid().selected.map((x) => x.name);
    this.toastr.info(translate('attributes-browser.delete-warning'));
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
          return isConfirmed ? this.api.deleteSchemaAttributes(toDelete) : of(null);
        }),
      )
      .subscribe((result) => {
        this.loadData();
      });
  }
}
