import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, TemplateRef, ViewChild } from "@angular/core";

@Component({
    selector: 'md-dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    styleUrls: ['./dropdown-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuComponent {
    @Input() items!: any[];  
    @Input() direction: 'up' | 'right' = 'right';
    @Input() itemTemplate!: TemplateRef<any>;

    @ViewChild('menu') menu!: ElementRef;

    dropdownVisible = false;
    unlistenClick =  () => {};
    constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {
    }

    private positionMenu() {

    }

    private checkOverflow() {
        const bottomPoint = this.menu.nativeElement.offsetTop + this.menu.nativeElement.offsetHeight;
        if(bottomPoint > window.innerHeight)
        {
            this.renderer.setStyle(this.menu.nativeElement, 'top', 
               `${  window.innerHeight - this.menu.nativeElement.offsetHeight - 32}px`);
        }

        const rightPoint = this.menu.nativeElement.offsetLeft + this.menu.nativeElement.offsetWidth;
        if(rightPoint > window.innerWidth)
        {
            this.renderer.setStyle(this.menu.nativeElement, 'left', 
               `${  window.innerWidth - this.menu.nativeElement.getBoundingClientRect().width - 32}px`);
        }
    }

    private setOutsideClickHandler() {
        setTimeout(() => {
            this.unlistenClick = this.renderer.listen('window', 'click', (e) => {
                if(this.dropdownVisible && 
                    !this.menu.nativeElement.contains(e.target) )
                {
                    this.close();
                }
            })
        });
    }

    open() {
        this.dropdownVisible = true;
        this.cdr.detectChanges();
        this.positionMenu()
        this.checkOverflow();
        this.cdr.detectChanges();
        this.setOutsideClickHandler();
    }

    close() {
        this.dropdownVisible = false;
        this.unlistenClick();
        this.unlistenClick = () => {};
        this.cdr.detectChanges();
    }
    
    toggle() {
        if(this.dropdownVisible) 
            this.close()
        else 
            this.open();
    }
}