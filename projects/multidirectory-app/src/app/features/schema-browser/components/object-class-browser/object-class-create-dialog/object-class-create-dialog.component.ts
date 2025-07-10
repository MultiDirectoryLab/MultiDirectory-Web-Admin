import { ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ObjectClassCreateGeneralComponent } from '../forms/object-class-general/object-class-general.component';
import { ObjectClassAttributeSummaryComponent } from '../forms/object-class-attribute-summary/object-class-attribute-summary.component';
import { TranslocoModule } from '@jsverse/transloco';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '@components/modals/services/dialog.service';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ObjectClassCreateDialogData } from '../object-class-create-dialog.interface';

@Component({
  selector: 'app-object-class-create-dialog',
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    ObjectClassCreateGeneralComponent,
    ObjectClassAttributeSummaryComponent,
    ReactiveFormsModule,
    TranslocoModule,
    CommonModule,
  ],
  templateUrl: './object-class-create-dialog.component.html',
  styleUrl: './object-class-create-dialog.component.scss',
})
export class ObjectClassCreateDialogComponent {
  private readonly dialogData = inject<ObjectClassCreateDialogData>(DIALOG_DATA);
  private readonly dialog = inject(DialogService);
  private readonly dialogRef = inject(DialogRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  stepValid = false;
  objectClass: SchemaObjectClass = this.dialogData.objectClass ?? new SchemaObjectClass({});

  finish() {
    this.dialog.close(this.dialogRef, this.objectClass);
  }

  cancel() {
    this.dialog.close(this.dialogRef);
  }
  setStepValid(x: boolean) {
    this.stepValid = x;
    this.cdr.detectChanges();
  }
}
