import { NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { Component, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'md-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [NgClass, NgStyle, NgOptimizedImage],
})
export class TooltipComponent implements OnDestroy {
  private elRef = inject(ElementRef);

  @Input() iconPath = 'info-circle.svg';
  @Input() delay = 200;
  @Input() width = 140;
  @Input() left = 150;
  tooltipVisible = false;
  unsubscribe = new Subject<boolean>();

  clickOutsideListener = (e?: any) => {};

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

  public handleClickOuside(e: Event) {
    if (this.elRef?.nativeElement.contains(e.target)) {
      e.stopPropagation();
    }
    this.tooltipVisible = !this.tooltipVisible;
    document.removeEventListener('mousedown', this.clickOutsideListener, { capture: true });
    this.clickOutsideListener = () => {};
    return true;
  }

  private setOutsideClickHandler() {
    this.clickOutsideListener = this.handleClickOuside.bind(this);
    document.addEventListener('mousedown', this.clickOutsideListener, { capture: true });
  }
}
