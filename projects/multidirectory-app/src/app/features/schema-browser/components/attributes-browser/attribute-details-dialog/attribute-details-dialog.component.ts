import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DialogComponent } from '../../../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AttributeDetailsDialogData } from '../attribute-details-dialog.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';
import { AttributeListEntry } from '@components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';

@Component({
  selector: 'app-attribute-details-dialog',
  imports: [DialogComponent, TranslocoModule, MultidirectoryUiKitModule, CommonModule, ReactiveFormsModule],
  templateUrl: './attribute-details-dialog.component.html',
  styleUrl: './attribute-details-dialog.component.scss',
})
export class AttributeDetailsDialogComponent implements OnInit {
  private dialog = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private dialogData = inject<AttributeDetailsDialogData>(DIALOG_DATA);
  private attributeInput = signal<SchemaAttributeType | undefined>(this.dialogData.attribute);
  isEdit = this.dialogData.edit;
  tree: AttributeListEntry[] = [];
  attribute = computed<SchemaAttributeType>(() => {
    return (
      this.attributeInput() ??
      new SchemaAttributeType({
        oid: '',
        name: '',
        single_value: false,
        syntax: '',
        no_user_modification: false,
        is_system: false,
      })
    );
  });

  form = new FormGroup({
    oid: new FormControl(this.attribute().oid, [Validators.required]),
    name: new FormControl(this.attribute().name, [Validators.required]),
    single_value: new FormControl(this.attribute().single_value),
  });

  ngOnInit(): void {
    if (this.isEdit) {
      this.form.controls.oid.disable();
      this.form.controls.name.disable();
    }
    if (this.attribute().is_system) {
      this.form.controls.oid.disable();
      this.form.controls.name.disable();
      this.form.controls.single_value.disable();
    }

    this.tree =
      this.attributeInput()?.object_class_names?.map(
        (x) =>
          new AttributeListEntry({
            name: x,
            id: x,
            selectable: true,
            type: '',
            new: false,
          }),
      ) ?? [];
  }

  onSumbit(event: SubmitEvent) {
    this.dialog.close(
      this.dialogRef,
      new SchemaAttributeType({
        oid: this.form.value.oid ?? this.attribute().oid ?? '',
        name: this.form.value.name ?? this.attribute().name ?? '',
        no_user_modification: false,
        single_value: this.form.value.single_value ?? false,
        syntax: '',
        is_system: false,
      }),
    );
  }

  cancel() {
    this.dialog.close(this.dialogRef);
  }
}
