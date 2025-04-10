import { Component, OnInit, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-delete-confirmation-modal',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
  templateUrl: './delete-confirmation-modal.component.html',
  imports: [TranslocoPipe, ButtonComponent],
})
export class DeleteConfirmationModalComponent implements OnInit {
  private modalControl = inject<ModalInjectDirective>(ModalInjectDirective);

  toDeleteDNs: string[] = [];

  ngOnInit(): void {
    this.toDeleteDNs = this.modalControl.contentOptions?.['toDeleteDNs'] ?? [];
  }

  deleteSelectedEntry() {
    this.modalControl.close(true);
  }

  close() {
    this.modalControl.close(false);
  }
}
