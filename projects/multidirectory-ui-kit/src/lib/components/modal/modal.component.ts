import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { ModalComponent } from "ng-modal-full-resizable";

@Component({
    selector: 'md-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdModalComponent implements AfterViewInit {
    @ViewChild('modalRoot', { static: false }) modalRoot?: ModalComponent;
    @Input() opened = false;
    @Input() backdrop = true;
    @Input() height: string = '';

    constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {
    }

    open() {
         this.modalRoot?.show();
         this.cdr.detectChanges();
    }
    
    close() {   
        this.modalRoot?.hide();
        this.cdr.detectChanges();
    }

    ngAfterViewInit(): void {
        if(this.opened) {
            this.open();
            this.modalRoot?.calcBodyHeight();
            this.modalRoot?.center();
            this.renderer.setStyle(this.modalRoot?.modalBody.nativeElement, 'display', 'flex');
            this.renderer.setStyle(this.modalRoot?.modalBody.nativeElement, 'display', 'flex');
            this.cdr.detectChanges();
        }
    }
}