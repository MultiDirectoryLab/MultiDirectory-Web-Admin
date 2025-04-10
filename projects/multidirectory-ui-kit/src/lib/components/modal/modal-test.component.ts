import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalInjectDirective } from './modal-inject/modal-inject.directive';
import { BaseControlComponent } from '../base-component/control.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal-test',
  template: `
    <ng-template modalInject #modal="modalInject">
      <div class="app-modal-header">Demo modal</div>
      <div class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s.
        </p>
      </div>
      <div class="app-modal-footer">
        <md-button type="button" #closeButton class="button button3" (click)="modal.showSpinner()"
          >Show Spinner
        </md-button>

        <md-button type="button" class="button button1" (click)="modal2.open()">Save</md-button>

        <md-button
          type="button"
          class="button button2"
          style="float: right;"
          (click)="modal.close()"
          >Close
        </md-button>
      </div>
    </ng-template>

    <ng-template modalInject #modal2="modalInject">
      <div class="app-modal-header">Demo modal</div>
      <div class="app-modal-body">
        <h3>MODAL DIALOG</h3>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s.
        </p>
      </div>
      <div class="app-modal-footer">
        <md-button type="button" #closeButton class="button button3" (click)="modal.close()"
          >Delete
        </md-button>
        <md-button type="button" class="button button1" (click)="modal2.close()">Save</md-button>
        <md-button
          type="button"
          class="button button2"
          style="float: right;"
          (click)="modal2.close()"
          >Close
        </md-button>
      </div>
    </ng-template>
  `,
  imports: [ButtonComponent, ModalInjectDirective],
})
export class ModalTestComponent extends BaseControlComponent {
  @ViewChild('modal', { static: true }) modal?: ModalInjectDirective;
  @ViewChild('closeButton', { static: true }) closeButton?: ElementRef<HTMLButtonElement>;

  open() {
    this.modal?.open();
  }

  close() {
    this.modal?.close();
  }
}
