import { Directive, ElementRef, HostListener, Input, OnInit } from "@angular/core";
import { DropdownMenuComponent } from "./dropdown-menu.component";

@Directive({
    selector: '[mdDropdownContainer]'
})
export class DropdownContainerDirective implements OnInit {
    @Input() mdDropdownContainer!: DropdownMenuComponent;
    @Input() openMenuOnClick = true; 
    constructor(private el: ElementRef) {
    }
    
    ngOnInit() {
        if(this.mdDropdownContainer) {
            this.mdDropdownContainer.container = this;
        }
    }
    @HostListener('click', ['$event']) onClick($event: Event)  {
        if(!this.openMenuOnClick) {
            return;
        }
        $event?.stopPropagation();
        this.toggleMenu();
    }

    toggleMenu(focus = true, minWidth: number | undefined = undefined) {
        var rectObject = this.el.nativeElement.getBoundingClientRect();
        this.mdDropdownContainer.setPosition(
            rectObject.x, 
            rectObject.y + rectObject.height);
        this.mdDropdownContainer.setMinWidth(minWidth);
        this.mdDropdownContainer.toggle(this.el, focus);
    }

    isVisible(): boolean {
        return this.mdDropdownContainer.dropdownVisible;
    }
    
    focus() {
        this.mdDropdownContainer.focus();
    }
}