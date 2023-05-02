import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewChildren } from "@angular/core";
import { ModalComponent } from "ng-modal-full-resizable";

@Component({
    selector: 'md-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdModalComponent implements AfterViewInit {
    @ViewChild('modalRoot', { static: false }) modalRoot?: ModalComponent;
    @Input() opened = true;
    constructor(private cdr: ChangeDetectorRef) {}

    open() {
         this.modalRoot?.show();
    }
    
    close() {   
        this.modalRoot?.hide();
    }

    ngAfterViewInit(): void {
        if(this.opened) {
            this.open();
            this.cdr.detectChanges();
        }
    }
}