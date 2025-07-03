import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { DialogService } from '@components/modals/services/dialog.service';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaService } from '@services/schema/schema.service';
import { MultidirectoryUiKitModule, MultiselectComponent } from 'multidirectory-ui-kit';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';

@Component({
  selector: 'app-schema-entity-add-object-class-dialog',
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoModule, CommonModule, FormsModule],
  templateUrl: './schema-entity-add-object-class-dialog.component.html',
  styleUrl: './schema-entity-add-object-class-dialog.component.scss',
})
export class SchemaEntityAddObjectClassDialogComponent {
  private schema = inject(SchemaService);

  dialogData = inject(DIALOG_DATA);
  dialog = inject(DialogService);
  dialogRef = inject(DialogRef);
  selector = viewChild.required<MultiselectComponent>('selector');
  objectClassNames: MultiselectModel[] = [];
  availableClassNames: MultiselectModel[] = [];

  checkClassNames($event: string) {
    this.schema.getObjectClasses(0, 100, $event).subscribe((result) => {
      this.availableClassNames = result.items.map(
        (x) =>
          new MultiselectModel({
            id: x.oid,
            badge_title: x.name,
            title: x.name,
          }),
      );
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const selected = this.selector().selectedData.map((x) => x.title);
    this.dialog.close(this.dialogRef, selected);
  }

  onCancel($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.close(this.dialogRef);
  }
}
