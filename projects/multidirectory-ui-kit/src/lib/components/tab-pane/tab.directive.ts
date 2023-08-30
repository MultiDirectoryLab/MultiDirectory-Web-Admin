import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";

@Directive({
    selector: '[mdTab]',
    exportAs: 'mdTab'
})
export class TabDirective implements OnInit {
    get el(): HTMLElement {
        return this.elRef.nativeElement;
    }
    constructor(public elRef: ElementRef) {
    }
    
    ngOnInit() {
    }
}