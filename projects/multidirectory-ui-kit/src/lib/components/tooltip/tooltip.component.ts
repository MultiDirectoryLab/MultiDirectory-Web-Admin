import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject, delay, skipWhile, takeUntil } from "rxjs";

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
    mouseInsideRx = new Subject<boolean>();
    mouseOutside = true;
    unsubscribe = new Subject<boolean>();

    ngOnInit(): void {
        this.mouseInsideRx.pipe(
            takeUntil(this.unsubscribe),
            delay(this.delay),
            skipWhile(() => this.mouseOutside)
        ).subscribe(x => {
            this.tooltipVisible = true;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    
    onMouseEnter(event: MouseEvent) {
        this.mouseOutside = false;
        this.mouseInsideRx.next(true);
    }

    onMouseLeave(event: MouseEvent) {
        this.mouseOutside = true;
        this.mouseInsideRx.next(false);
        this.tooltipVisible = false;
    }
}