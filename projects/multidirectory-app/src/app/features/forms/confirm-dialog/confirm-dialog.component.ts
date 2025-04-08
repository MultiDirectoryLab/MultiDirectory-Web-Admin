import { Component, OnInit, inject } from '@angular/core';
import { ConfirmDialogDescriptor } from '@models/confirm-dialog/confirm-dialog-descriptor';
import { ButtonComponent, ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [ButtonComponent],
})
export class ConfirmDialogComponent implements OnInit {
  private modalControl = inject(ModalInjectDirective);

  prompt: ConfirmDialogDescriptor = {
    promptHeader: 'Требуется подверждение',
    promptText: 'Применить изменения',
    primaryButtons: [{ id: 'Да', text: 'Да' }],
    secondaryButtons: [{ id: 'Нет', text: 'Нет' }],
  };

  ngOnInit(): void {
    if (this.modalControl.contentOptions.prompt) {
      this.prompt = Object.assign({}, this.modalControl.contentOptions.prompt);
    }
  }

  onClick(id: string) {
    this.modalControl.close(id);
  }
}
