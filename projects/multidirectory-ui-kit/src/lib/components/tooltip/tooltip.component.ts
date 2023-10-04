import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject, delay, fromEvent, skipWhile, takeUntil } from "rxjs";

@Component({
    selector: 'md-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit, OnDestroy{
    @Input() iconPath = 'info-circle.svg';
    @Input() delay = 200;
    @Input() width = 140;
    tooltipVisible = false;
    unsubscribe = new Subject<boolean>();

    constructor(private elRef: ElementRef) {}
    clickOutsideListener = (e?: any) => {};
    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    toogleTooltip(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.tooltipVisible = !this.tooltipVisible;
        this.setOutsideClickHandler();
    }

    
    private setOutsideClickHandler() {
        this.clickOutsideListener = this.handleClickOuside.bind(this);
        document.addEventListener('mousedown',  this.clickOutsideListener, { capture: true  });
    }


    public handleClickOuside(e: Event) {
        if(this.elRef?.nativeElement.contains(e.target)) {
            e.stopPropagation();
        }
        this.tooltipVisible = !this.tooltipVisible;
        document.removeEventListener('mousedown', this.clickOutsideListener, { capture: true });
        this.clickOutsideListener = () => {};    
        return true;
    }
}