import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { DialogService } from '../../../services/dialog.service';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { Group } from '@core/groups/group';
import { LdapModificationRecord, LdapRenameRequest } from '@core/ldap/ldap-rename.request';

@Component({
  selector: 'app-rename-group-dialog',
  templateUrl: './rename-group-dialog.component.html',
  styleUrls: ['./rename-group-dialog.component.scss'],
  imports: [DialogComponent, ReactiveFormsModule, TranslocoModule, MultidirectoryUiKitModule],
})
export class RenameGroupDialogComponent {
  private dialogRef = inject(DialogRef);
  private dialog = inject(DialogService);
  private group: Group = inject(DIALOG_DATA);
  private fb = inject(FormBuilder);

  protected form = this.fb.nonNullable.group({
    groupName: [this.group.name, [Validators.required]],
  });

  protected onSubmit() {
    this.dialog.close(this.dialogRef, this.buildRenameRequest());
  }

  private buildRenameRequest(): LdapRenameRequest {
    const groupName = this.form.controls.groupName.getRawValue();
    const groupDn = this.group.dn;

    if (!groupName || !groupDn) {
      return {} as LdapRenameRequest;
    }

    const newCn = `cn=${groupName}`;

    return {
      object: groupDn,
      newrdn: newCn,
      changes: [
        new LdapModificationRecord(2, { type: 'sAMAccountName', vals: [groupName] }),
        new LdapModificationRecord(2, { type: 'name', vals: [groupName] }),
      ],
    };
  }

  protected cancel() {
    this.dialog.close(this.dialogRef, null);
  }
}
