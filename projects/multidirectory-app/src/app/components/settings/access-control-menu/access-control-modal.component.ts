import { Component, ViewChild } from "@angular/core";
import { MdModalComponent } from "multidirectory-ui-kit";

@Component({
    selector: 'app-access-control-menu-modal',
    template: `
    <md-modal #accessControlModal width="800px" minHeight="400px">
        <div class="app-modal-header">
            Контроль доступа
        </div>
        <app-access-control-menu></app-access-control-menu>
    </md-modal>
    `
})
export class AccessControlClientModalComponent {
    @ViewChild('accessControlModal', { static: true }) accessControlModal: MdModalComponent | null = null;

    open() {
        this.accessControlModal?.open();
    }

    close() {
        this.accessControlModal?.close();
    }
}