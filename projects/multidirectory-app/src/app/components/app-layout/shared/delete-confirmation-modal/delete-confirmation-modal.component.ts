import { Component, Inject, OnInit } from '@angular/core';
import { ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-delete-confirmation-modal',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
  templateUrl: './delete-confirmation-modal.component.html',
})
export class DeleteConfirmationModalComponent implements OnInit {
  toDeleteDNs: string[] = [];
  constructor(@Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {}
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
