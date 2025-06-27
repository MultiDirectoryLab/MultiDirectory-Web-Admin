import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaService } from '@services/schema/schema.service';
import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { AttributeDetailsDialogComponent } from './attribute-details-dialog/attribute-details-dialog.component';
import {
  AttributeDetailsDialogData,
  AttributeDetailsDialogReturnData,
} from './attribute-details-dialog.interface';
import { EMPTY, of, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-attributes-browser',
  imports: [CommonModule, TranslocoModule, MultidirectoryUiKitModule],
  templateUrl: './attributes-browser.component.html',
  styleUrl: './attributes-browser.component.scss',
})
export class AttributesBrowserComponent implements OnInit {
  private schema = inject(SchemaService);
  private dialog = inject(DialogService);
  attributeTypes = signal<SchemaAttributeType[]>([]);

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
    this.schema.getAttributes(this.offset, this.limit).subscribe((result) => {
      this.total = result.metadata.total_count;
      this.attributeTypes.set(result.items);
    });
  }

  columns = signal<TableColumn[]>([
    { name: translate('schema-attributes-browser.column-name'), prop: 'name' },
    { name: translate('schema-attributes-browser.column-type'), prop: 'type' },
  ]);

  openAttirbuteDetailsDialog(event: InputEvent | null) {
    const attribute = (event as never as { row: SchemaAttributeType })?.row ?? null;
    this.showAttributeDialog(attribute, true)
      .pipe(
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
      .subscribe();
  }

  openAttribute(attributeName: string) {
    this.schema
      .getAttribute(attributeName)
      .pipe(
        switchMap((attribute) => {
          if (!attribute) {
            return EMPTY;
          }
          console.log(attribute);
          return this.showAttributeDialog(attribute, true);
        }),
        switchMap((result) => {
          if (!result) {
            return EMPTY;
          }
          console.log(result);
          return this.schema.updateAttribute(result);
        }),
      )
      .subscribe();
  }

  private showAttributeDialog(attribute: SchemaAttributeType, isEdit: boolean) {
    return this.dialog
      .open<
        AttributeDetailsDialogReturnData,
        AttributeDetailsDialogData,
        AttributeDetailsDialogComponent
      >({
        component: AttributeDetailsDialogComponent,
        dialogConfig: {
          data: {
            attribute: attribute,
            edit: isEdit,
          },
        },
      })
      .closed.pipe(take(1));
  }
}
