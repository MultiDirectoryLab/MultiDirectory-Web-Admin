import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DropdownOption, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { EntityAttributeType } from '@core/entity-attributes/entity-attribute-type';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  PropertyEditDialogData,
  PropertyEditDialogReturnData,
} from '../../../interfaces/property-edit-dialog.interface';
import { FormsModule } from '@angular/forms';
import { StringPropertyEditorComponent } from '@features/ldap-browser/components/editors/typed-editors/string/string-property-editor.component';
import { IntegerPropertyEditorComponent } from '@features/ldap-browser/components/editors/typed-editors/integer/integer-property-editor.component';
import { MultivaluedStringComponent } from '@features/ldap-browser/components/editors/typed-editors/multivalued-string/multivalued-string.component';
import { DialogComponent } from '../../core/dialog/dialog.component';

@Component({
  selector: 'app-property-edit-dialog',
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    TranslocoPipe,
    FormsModule,
    StringPropertyEditorComponent,
    IntegerPropertyEditorComponent,
    MultivaluedStringComponent,
    DialogComponent,
  ],
  templateUrl: './property-edit-dialog.component.html',
  styleUrl: './property-edit-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyEditDialogComponent {
  public LdapPropertyType = EntityAttributeType;
  public propertyTypes = Object.values(EntityAttributeType)
    .filter((x) => Number.isNaN(Number(x)))
    .map(
      (x) =>
        new DropdownOption({
          title: String(x),
          value: x,
        }),
    );
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<PropertyEditDialogReturnData, PropertyEditDialogComponent> =
    inject(DialogRef);
  private dialogData: PropertyEditDialogData = inject(DIALOG_DATA);
  public editRequest: PropertyEditDialogData = { ...this.dialogData };

  public close(): void {
    this.dialogService.close(this.dialogRef, null);
  }

  public finish(): void {
    this.dialogService.close(this.dialogRef, this.editRequest);
  }
}
