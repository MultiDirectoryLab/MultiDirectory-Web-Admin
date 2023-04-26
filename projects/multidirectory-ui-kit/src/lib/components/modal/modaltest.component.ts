import { Component, ElementRef, ViewChild } from "@angular/core";
import { MdModalComponent } from "./modal.component";

@Component({
    template: `
        <md-modal #modal>
            <ng-container class="app-modal-header">Demo modal</ng-container>
            <ng-container class="app-modal-body">
            <h3>MODAL DIALOG</h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
            </ng-container>
            <ng-container class="app-modal-footer">
                <button type="button" #closeButton class="button button3" (click)="modal.close()">Delete</button>
                <button type="button" class="button button1" (click)="modal.close()">Save</button>
                <button type="button" class="button button2" style="float: right;" (click)="modal.close()">Close
            </button>
            </ng-container>
        </md-modal>
        <button #openBtn (click)="modal.open()">Open modal</button>
    `
})
export class ModalTestComponent {
    @ViewChild('modal', { static: true } ) ModalComponent?: MdModalComponent;
    @ViewChild('openBtn', { static: true }) openButton?: ElementRef<HTMLButtonElement>;
    @ViewChild('closeButton', { static: true }) closeButton?: ElementRef<HTMLButtonElement>;
}
