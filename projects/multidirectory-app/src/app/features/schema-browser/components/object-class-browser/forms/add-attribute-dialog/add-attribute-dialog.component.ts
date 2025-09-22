import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { DialogService } from '@components/modals/services/dialog.service';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaService } from '@services/schema/schema.service';
import { MultidirectoryUiKitModule, MultiselectComponent } from 'multidirectory-ui-kit';
import { MultiselectModel } from 'projects/multidirectory-ui-kit/src/lib/components/multiselect/mutliselect-model';

@Component({
  selector: 'app-add-attribute-dialog',
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoModule, CommonModule, FormsModule],
  templateUrl: './add-attribute-dialog.component.html',
  styleUrl: './add-attribute-dialog.component.scss',
})
export class AddAttributeDialogComponent {
  private schema = inject(SchemaService);

  dialogData = inject(DIALOG_DATA);
  dialog = inject(DialogService);
  dialogRef = inject(DialogRef);
  selector = viewChild.required<MultiselectComponent>('selector');
  attributes: MultiselectModel[] = [];
  availableAttributes: MultiselectModel[] = [];
  selectedAttributes: MultiselectModel[] = [];

  checkAttributes($event: string) {
    this.schema.getAttributes(0, 100, $event).subscribe((result) => {
      this.availableAttributes = result.items.map(
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
    const selected = this.selector()
      .selectedData()
      .map((x) => x.title);
    this.dialog.close(this.dialogRef, selected);
  }

  onCancel($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.close(this.dialogRef);
  }
}
