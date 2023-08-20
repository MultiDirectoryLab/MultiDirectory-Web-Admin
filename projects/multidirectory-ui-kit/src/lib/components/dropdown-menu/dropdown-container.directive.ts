import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";
import { DropdownMenuComponent } from "./dropdown-menu.component";

@Directive({
    selector: '[mdDropdownContainer]'
})
export class DropdownContainerDirective implements OnInit {
    @Input() mdDropdownContainer!: DropdownMenuComponent;
    constructor(private el: ElementRef) {
    }
    
    ngOnInit() {
        if(this.mdDropdownContainer) {
            this.mdDropdownContainer.container = this;
        }
    }
    @HostListener('click', ['$event']) onClick($event: Event) {
        $event.stopPropagation();
        var rectObject = this.el.nativeElement.getBoundingClientRect();

        this.mdDropdownContainer.setPosition(
            rectObject.x, 
            rectObject.y + rectObject.height);

        this.mdDropdownContainer.toggle(this.el);
    }
}