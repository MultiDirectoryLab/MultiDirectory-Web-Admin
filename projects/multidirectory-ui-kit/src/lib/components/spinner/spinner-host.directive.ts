import { AfterViewInit, ComponentRef, Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Directive({
  selector: '[spinnerHost]',
})
export class SpinnerHostDirective implements AfterViewInit {
    @Input() spinnerName = '';

    public spinner?: SpinnerComponent;
    public spinnerRef?: ComponentRef<SpinnerComponent>;
    constructor(
        public renderer2: Renderer2,
        public el: ElementRef,
        public viewContainerRef: ViewContainerRef) { 
    }

    ngAfterViewInit(): void {
        this.spinnerRef = this.viewContainerRef.createComponent(SpinnerComponent);
        this.spinner = this.spinnerRef.instance;
        this.spinner.name = this.spinnerName;
        this.renderer2.appendChild(this.el.nativeElement.children[1], this.spinnerRef.location.nativeElement);
    }

    show() {
        this.spinner?.show();
    }

    hide() {
        this.spinner?.hide();
    }
}