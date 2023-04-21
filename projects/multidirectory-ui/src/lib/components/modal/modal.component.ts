import { Component, ViewChild } from "@angular/core";
import { ModalComponent } from "ng-modal-full-resizable";

@Component({
    selector: 'mf-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class MfModalComponent {
    @ViewChild('modalRoot', { static: false }) modalRoot?: ModalComponent;

    open() {
        this.modalRoot?.show();
    }
    
    close() {
        this.modalRoot?.hide();
    }


}