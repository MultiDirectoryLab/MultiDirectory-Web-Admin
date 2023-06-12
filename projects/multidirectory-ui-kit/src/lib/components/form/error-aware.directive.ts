import { Directive, OnInit, OnDestroy, ViewContainerRef, Renderer2, Input, EventEmitter, Output } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Subject, BehaviorSubject, takeUntil } from "rxjs";

@Directive({
    selector: '[mdErrorAware]',
})
export class ErrorAwareDirective implements OnInit, OnDestroy {
    @Input() errorLabel?: HTMLLabelElement;
    unsubscribe = new Subject<void>();
    validRx = new BehaviorSubject<boolean>(false);
    @Output() errorChecked = new EventEmitter<boolean>()
    get valid(): boolean {
        return this.validRx.getValue();
    }
    constructor(
        private el: ViewContainerRef, 
        private ngControl: NgControl,
        private renderer: Renderer2) {
    }

    ngOnInit(): void {
        if(!this.errorLabel) {
            this.errorLabel = this.renderer.createElement('label');
            this.renderer.appendChild(this.el.element.nativeElement, this.errorLabel);
        }
        this.renderer.addClass(this.errorLabel, 'error-message');
        if(this.el.element.nativeElement.name) {
            this.renderer.setAttribute(this.errorLabel, 'for', this.el.element.nativeElement.name);
        }
        this.ngControl.statusChanges?.pipe(takeUntil(this.unsubscribe)).subscribe(status => {
            this.renderer.setProperty(this.errorLabel, 'innerHTML', '&nbsp;');
            this.validRx.next(this.ngControl.valid ?? false);
            let result = true;
            if(this.ngControl.touched || this.ngControl.dirty)
            {
                if(this.ngControl.errors?.['required']) {
                    this.renderer.setProperty(this.errorLabel, 'innerHTML', 'Value is required');
                    result = false;
                }
                if(this.ngControl.errors?.['pattern']) {
                    this.renderer.setProperty(this.errorLabel, 'innerHTML', 'Value has wrong format');
                    result = false;
                }
            }
            this.errorChecked.emit(result);
        });

    }
       
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    } 
}
