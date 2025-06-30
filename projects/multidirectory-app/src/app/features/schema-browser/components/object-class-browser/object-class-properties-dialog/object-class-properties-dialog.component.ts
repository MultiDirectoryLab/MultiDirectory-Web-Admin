import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DialogComponent } from '../../../../../components/modals/components/core/dialog/dialog.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoModule } from '@jsverse/transloco';
import { ObjectClassCreateGeneralComponent } from '../forms/object-class-general/object-class-general.component';
import { ObjectClassAttributeSummaryComponent } from '../forms/object-class-attribute-summary/object-class-attribute-summary.component';
import { ObjectClassEntriesComponent } from '../forms/object-class-entries/object-class-entries.component';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '@components/modals/services/dialog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-object-class-properties',
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    TranslocoModule,
    CommonModule,
    ObjectClassCreateGeneralComponent,
    ObjectClassAttributeSummaryComponent,
    ObjectClassEntriesComponent,
  ],
  templateUrl: './object-class-properties-dialog.component.html',
  styleUrl: './object-class-properties-dialog.component.scss',
})
export class ObjectClassPropertiesDialogComponent implements OnInit {
  private readonly dialog = inject(DialogService);
  private readonly dialogRef = inject(DialogRef);
  private readonly dialogData = inject(DIALOG_DATA);
  objectClass: SchemaObjectClass = this.dialogData.objectClass;

  ngOnInit(): void {
    console.log(this.objectClass);
  }

  onApplyClick() {
    this.dialog.close(this.dialogRef, this.objectClass);
  }
  onCancelClick() {
    this.dialog.close(this.dialogRef, null);
  }
}
