import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { DialogComponent } from '../../../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AttributeDetailsDialogData } from '../attribute-details-dialog.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';

@Component({
  selector: 'app-attribute-details-dialog',
  imports: [
    DialogComponent,
    TranslocoModule,
    MultidirectoryUiKitModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './attribute-details-dialog.component.html',
  styleUrl: './attribute-details-dialog.component.scss',
})
export class AttributeDetailsDialogComponent implements OnInit {
  private dialog = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private dialogData = inject<AttributeDetailsDialogData>(DIALOG_DATA);
  private attributeInput = signal<SchemaAttributeType | undefined>(this.dialogData.attribute);
  isEdit = this.dialogData.edit;
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
    no_user_modification: new FormControl(this.attribute().no_user_modification),
    syntax: new FormControl(this.attribute().syntax, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.isEdit) {
      this.form.controls.oid.disable();
      this.form.controls.name.disable();
    }
  }

  onSumbit(event: SubmitEvent) {
    this.dialog.close(
      this.dialogRef,
      new SchemaAttributeType({
        oid: this.form.value.oid ?? this.attribute().oid ?? '',
        name: this.form.value.name ?? this.attribute().name ?? '',
        no_user_modification: this.form.value.no_user_modification ?? false,
        single_value: this.form.value.single_value ?? false,
        syntax: this.form.value.syntax ?? '',
        is_system: false,
      }),
    );
  }
}
