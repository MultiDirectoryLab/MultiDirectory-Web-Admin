import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ConfirmDeleteDialogData,
  ConfirmDeleteDialogReturnData,
} from '../../../interfaces/confirm-delete-dialog.interface';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MultidirectoryUiKitModule, TranslocoPipe, DialogComponent],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialogComponent {
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<ConfirmDeleteDialogReturnData, ConfirmDeleteDialogComponent> =
    inject(DialogRef);
  private dialogData: ConfirmDeleteDialogData = inject(DIALOG_DATA);

  toDeleteDNs: string[] = this.dialogData.toDeleteDNs;

  deleteSelectedEntry() {
    this.dialogService.close(this.dialogRef, true);
  }

  close() {
    this.dialogService.close(this.dialogRef, false);
  }
}
