import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { DialogService } from '@components/modals/services/dialog.service';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-schema-entity-add-object-class-dialog',
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    TranslocoModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './schema-entity-add-object-class-dialog.component.html',
  styleUrl: './schema-entity-add-object-class-dialog.component.scss',
})
export class SchemaEntityAddObjectClassDialogComponent {
  dialogData = inject(DIALOG_DATA);
  dialog = inject(DialogService);
  dialogRef = inject(DialogRef);

  private fb = inject(FormBuilder);
  form = this.fb.group({
    objectClassName: new FormControl(this.dialogData),
  });

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.dialog.close(this.dialogRef, this.form.value.objectClassName);
  }
}
