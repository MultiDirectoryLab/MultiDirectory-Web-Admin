import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

@Component({
    selector: 'md-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements AfterViewInit, OnDestroy {
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

    onKeydown($event: KeyboardEvent) {
        if($event.key == 'Enter' || $event.key == ' ') {
            this.click.next($event);
        }
    }
}