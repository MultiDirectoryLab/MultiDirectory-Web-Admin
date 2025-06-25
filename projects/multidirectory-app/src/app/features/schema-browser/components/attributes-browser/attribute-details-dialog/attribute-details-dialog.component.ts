import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { DialogComponent } from '../../../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { AttributeDetailsDialogData } from '../attribute-details-dialog.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  private dialogData = inject<AttributeDetailsDialogData>(DIALOG_DATA);
  private attributeInput = signal<SchemaAttributeType | undefined>(this.dialogData.attribute);

  attribute = computed<SchemaAttributeType>(() => {
    return this.attributeInput() ?? new SchemaAttributeType({});
  });

  form = new FormGroup({
    oid: new FormControl(this.attribute().oid),
    name: new FormControl(this.attribute().name),
    single_value: new FormControl(this.attribute().single_value),
    no_user_modification: new FormControl(this.attribute().no_user_modification),
    syntax: new FormControl(this.attribute().syntax),
  });

  ngOnInit(): void {
    console.log(this.attribute());
  }

  onSumbit(event: SubmitEvent) {
    alert('submitted');
    console.log(event, this.form.value);
  }
}
