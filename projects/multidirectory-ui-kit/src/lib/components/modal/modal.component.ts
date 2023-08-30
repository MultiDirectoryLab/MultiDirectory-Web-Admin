import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { ModalComponent } from "ng-modal-full-resizable";
import { Observable, Subject, takeUntil } from "rxjs";
import { SpinnerComponent } from "../spinner/spinner.component";
import { SpinnerHostDirective } from "../spinner/spinner-host.directive";

@Component({
    selector: 'md-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdModalComponent implements AfterViewInit, OnDestroy {
    @ViewChild('modalRoot', { static: false }) modalRoot?: ModalComponent;
    @ViewChild(SpinnerHostDirective, { static: false }) spinnerHost?: SpinnerHostDirective;
    @Input() opened = false;
    @Input() backdrop = true;
    @Input() height: string = '';
    @Input() width: string = '';
    @Input() contentDisplay = false;
    @Output() onClose = new EventEmitter<void>();
    unsubscribe = new Subject<void>();
    
    constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {
    }
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    open(): Observable<boolean> | null {
        this.contentDisplay = true;
        this.modalRoot?.show();
        this.cdr.detectChanges();
        return this.modalRoot?.openModal.asObservable() ?? null;
    }

    onModalOpen() {
        if(this.width) {
            this.renderer.setStyle(this.modalRoot?.modalRoot.nativeElement, 'width', this.width);
        }
        this.modalRoot?.resizeToContentHeight();
        this.modalRoot?.center();
    }

    center() {
        this.modalRoot?.center();
    }

    close() {   
        this.modalRoot?.hide();
        this.cdr.detectChanges();
    }

    showSpinner() {
        this.spinnerHost?.show();
    }

    hideSpinner() {
        this.spinnerHost?.hide();
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
        this.modalRoot?.closeModal.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.contentDisplay = false;
            this.cdr.detectChanges();
            this.onClose.emit()
        });
    }
}