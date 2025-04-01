import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ConfirmDialogData,
  ConfirmDialogReturnData,
} from '../../../interfaces/confirm-dialog.interface';
import { DialogService } from '../../../services/dialog.service';
import { DialogComponent } from '../../core/dialog/dialog.component';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MultidirectoryUiKitModule, DialogComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<ConfirmDialogReturnData, ConfirmDialogComponent> = inject(DialogRef);
  private dialogData: ConfirmDialogData = inject(DIALOG_DATA);

  public prompt: ConfirmDialogData = this.dialogData ?? {
    promptHeader: 'Требуется подверждение',
    promptText: 'Применить изменения',
    primaryButtons: [{ id: 'Да', text: 'Да' }],
    secondaryButtons: [{ id: 'Нет', text: 'Нет' }],
  };

  public close(id: ConfirmDialogReturnData = 'cancel') {
    this.dialogService.close(this.dialogRef, id);
  }
}
