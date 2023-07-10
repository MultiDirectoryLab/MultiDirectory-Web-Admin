import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

@Component({
    selector: 'md-plane-button',
    templateUrl: './plane-button.component.html',
    styleUrls: ['./plane-button.component.scss']
})
export class PlaneButtonComponent implements AfterViewInit, OnDestroy {
    @Input() label = '';
    @Input() disabled = false;
    @Input() primary = false;
    @Output() click = new EventEmitter();
    unlistenClick =  () => {};

    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        this.unlistenClick =  this.el.nativeElement.addEventListener('click', (event: any) => {
            event.stopPropagation();
            if(this.disabled) {
                return;
            }
            this.click.emit(event);
        }, true);
    }

    ngOnDestroy(): void {
        if(this.unlistenClick) {
            this.unlistenClick();
        }
    }
}