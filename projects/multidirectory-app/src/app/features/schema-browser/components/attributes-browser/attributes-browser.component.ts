import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaService } from '@services/schema/schema.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TableColumn } from 'ngx-datatable-gimefork';
import { AttributeDetailsDialogComponent } from './attribute-details-dialog/attribute-details-dialog.component';
import {
  AttributeDetailsDialogData,
  AttributeDetailsDialogReturnData,
} from './attribute-details-dialog.interface';

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

  ngOnInit(): void {
    this.schema.getAttributes().subscribe((result) => {
      this.attributeTypes.set(result);
    });
  }

  columns = signal<TableColumn[]>([
    { name: translate('schema-attributes-browser.column-name'), prop: 'name' },
    { name: translate('schema-attirbutes-browser.column-type'), prop: 'type' },
  ]);

  openAttirbuteDetailsDialog(event: InputEvent | null) {
    const attribute = (event as never as { row: SchemaAttributeType })?.row ?? null;
    console.log(attribute);

    this.dialog.open<
      AttributeDetailsDialogReturnData,
      AttributeDetailsDialogData,
      AttributeDetailsDialogComponent
    >({
      component: AttributeDetailsDialogComponent,
      dialogConfig: {
        data: {
          attribute: attribute,
        },
      },
    });
  }
}
