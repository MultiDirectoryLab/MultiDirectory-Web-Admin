import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getEvent, isLeftButton } from '../common/utils';
import { ResizableEvent } from './types';

@Directive({
  selector: '[appResizable]',
})
export class ResizableDirective implements OnDestroy, AfterViewInit {
  private subscription?: Subscription;
  private newWidth: number = 0;
  private newHeight: number = 0;
  private newLeft: number = 0;
  private newTop: number = 0;
  private resizingS: boolean = false; // south
  private resizingE: boolean = false; // east
  private resizingSE: boolean = false; // south-east
  private resizingSW: boolean = false;
  private resizingW: boolean = false;
  private resizingNW: boolean = false;
  private resizingN: boolean = false;
  private resizingNE: boolean = false;
  private minWidth: number = 0;
  private maxWidth: number = 0;
  private minHeight: number = 0;
  private maxHeight: number = 0;
  @Input() appResizable = true;
  @Input() south: boolean = false;
  @Input() east: boolean = false;
  @Input() southEast: boolean = false;
  @Input() ghost: boolean = false;
  @Input() southWest: boolean = false;
  @Input() west: boolean = false;
  @Input() northWest: boolean = false;
  @Input() north: boolean = false;
  @Input() northEast: boolean = false;
  @Input() restrictHeight: number = 0;
  @Output() resizeBegin: EventEmitter<any> = new EventEmitter();
  @Output() resizing: EventEmitter<ResizableEvent> = new EventEmitter();
  @Output() resizeEnd: EventEmitter<ResizableEvent> = new EventEmitter();
  element: HTMLElement;

  constructor() {
    const element = inject(ElementRef);

    this.element = element.nativeElement;
  }

  ngAfterViewInit(): void {
    if (!this.appResizable) {
      return;
    }
    if (this.south) {
      this.createHandle('resize-handle-s');
    }
    if (this.east) {
      this.createHandle('resize-handle-e');
    }
    if (this.southEast) {
      this.createHandle('resize-handle-se');
    }
    if (this.southWest) {
      this.createHandle('resize-handle-sw');
    }
    if (this.west) {
      this.createHandle('resize-handle-w');
    }
    if (this.northWest) {
      this.createHandle('resize-handle-nw');
    }
    if (this.north) {
      this.createHandle('resize-handle-n');
    }
    if (this.northEast) {
      this.createHandle('resize-handle-ne');
    }
    const computedStyle = window.getComputedStyle(this.element);
    this.minWidth = parseFloat(computedStyle.minWidth);
    this.maxWidth = parseFloat(computedStyle.maxWidth);
    this.minHeight = this.restrictHeight ?? parseFloat(computedStyle.minHeight);
    this.maxHeight = parseFloat(computedStyle.maxHeight);
  }

  ngOnDestroy(): void {
    this.destroySubscription();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMousedown(event: MouseEvent | TouchEvent): void {
    if (!isLeftButton(event)) {
      return;
    }
    const classList = (event.target as HTMLElement).classList;
    const isSouth = classList.contains('resize-handle-s');
    const isEast = classList.contains('resize-handle-e');
    const isSouthEast = classList.contains('resize-handle-se');
    const isSouthWest = classList.contains('resize-handle-sw');
    const isWest = classList.contains('resize-handle-w');
    const isNorthWest = classList.contains('resize-handle-nw');
    const isNorth = classList.contains('resize-handle-n');
    const isNorthEast = classList.contains('resize-handle-ne');

    const evt = getEvent(event);
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const left = this.element.offsetLeft;
    const top = this.element.offsetTop;
    const screenX = evt.screenX;
    const screenY = evt.screenY;

    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

    if (
      isSouth ||
      isEast ||
      isSouthEast ||
      isSouthWest ||
      isWest ||
      isNorthWest ||
      isNorth ||
      isNorthEast
    ) {
      this.initResize(
        event,
        isSouth,
        isEast,
        isSouthEast,
        isSouthWest,
        isWest,
        isNorthWest,
        isNorth,
        isNorthEast,
      );

      const mouseup = fromEvent(document, upEvent);
      this.subscription = mouseup.subscribe((ev) => this.onMouseup(ev as MouseEvent | TouchEvent));

      const mouseMoveSub = fromEvent(document, moveEvent)
        .pipe(takeUntil(mouseup))
        .subscribe((e: Event) =>
          this.move(e as MouseEvent | TouchEvent, width, height, top, left, screenX, screenY),
        );

      this.subscription.add(mouseMoveSub);
    }
  }

  move(
    event: MouseEvent | TouchEvent,
    width: number,
    height: number,
    top: number,
    left: number,
    screenX: number,
    screenY: number,
  ): void {
    const evt = getEvent(event);
    const movementX = evt.screenX - screenX;
    const movementY = evt.screenY - screenY;

    this.newWidth =
      width - (this.resizingSW || this.resizingW || this.resizingNW ? movementX : -movementX);
    this.newHeight =
      height - (this.resizingNW || this.resizingN || this.resizingNE ? movementY : -movementY);
    this.newLeft = left + movementX;
    this.newTop = top + movementY;

    this.resizeWidth(evt);
    this.resizeHeight(evt);
  }

  onMouseup(event: MouseEvent | TouchEvent): void {
    this.endResize(event);
    this.destroySubscription();
  }

  initResize(
    event: MouseEvent | TouchEvent,
    isSouth: boolean,
    isEast: boolean,
    isSouthEast: boolean,
    isSouthWest: boolean,
    isWest: boolean,
    isNorthWest: boolean,
    isNorth: boolean,
    isNorthEast: boolean,
  ) {
    if (isSouth) {
      this.resizingS = true;
    }
    if (isEast) {
      this.resizingE = true;
    }
    if (isSouthEast) {
      this.resizingSE = true;
    }
    if (isSouthWest) {
      this.resizingSW = true;
    }

    if (isWest) {
      this.resizingW = true;
    }

    if (isNorthWest) {
      this.resizingNW = true;
    }

    if (isNorth) {
      this.resizingN = true;
    }

    if (isNorthEast) {
      this.resizingNE = true;
    }
    this.element.classList.add('resizing');
    this.newWidth = this.element.clientWidth;
    this.newHeight = this.element.clientHeight;
    this.newLeft = this.element.offsetLeft;
    this.newTop = this.element.offsetTop;
    event.stopPropagation();
    this.resizeBegin.emit();
  }

  endResize(event: MouseEvent | TouchEvent): void {
    this.resizingS = false;
    this.resizingE = false;
    this.resizingSE = false;
    this.resizingSW = false;
    this.resizingW = false;
    this.resizingNW = false;
    this.resizingN = false;
    this.resizingNE = false;
    this.element.classList.remove('resizing');
    this.resizeEnd.emit({ event: getEvent(event), width: this.newWidth, height: this.newHeight });
  }

  resizeWidth(event: MouseEvent | Touch): void {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingSE || this.resizingE || this.resizingNE) {
      if (overMinWidth && underMaxWidth) {
        if (!this.ghost) {
          this.element.style.width = `${this.newWidth}px`;
        }
      }
    }
    if (this.resizingSW || this.resizingW || this.resizingNW) {
      if (overMinWidth && underMaxWidth) {
        this.element.style.left = `${this.newLeft}px`;
        this.element.style.width = `${this.newWidth}px`;
      }
    }
    this.resizing.emit({
      event,
      width: this.newWidth,
      height: this.newHeight,
      direction: 'horizontal',
    });
  }

  resizeHeight(event: MouseEvent | Touch): void {
    const overMinHeight = !this.minHeight || this.newHeight >= this.minHeight;
    const underMaxHeight = !this.maxHeight || this.newHeight <= this.maxHeight;
    if (this.resizingSE || this.resizingS || this.resizingSW) {
      if (overMinHeight && underMaxHeight) {
        if (!this.ghost) {
          this.element.style.height = `${this.newHeight}px`;
        }
      }
    }

    if (this.resizingNW || this.resizingN || this.resizingNE) {
      if (overMinHeight && underMaxHeight) {
        if (!this.ghost) {
          this.element.style.top = `${this.newTop}px`;
          this.element.style.height = `${this.newHeight}px`;
        }
      }
    }
    this.resizing.emit({
      event,
      width: this.newWidth,
      height: this.newHeight,
      direction: 'vertical',
    });
  }

  private destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  private createHandle(edgeClass: string): void {
    const node = document.createElement('span');
    node.className = edgeClass;
    this.element.appendChild(node);
  }
}
