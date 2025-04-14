import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PopupContainerDirective } from '../popup-container.directive';

@Component({
  selector: 'md-popup-base',
  templateUrl: './popup-base.component.html',
  styleUrls: ['./popup-base.component.scss'],
})
export class PopupBaseComponent {
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('popup') popup!: ElementRef;

  @Input() items!: any[];
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() container?: PopupContainerDirective;
  @Input() closeOnClickOutside = true;

  _top: number = 0;
  _left: number = 0;
  _width?: number;
  _minWidth?: number;

  caller?: ElementRef;
  popupVisible = false;
  unlistenClick = () => {};
  unlistenListener = (e: Event) => {};

  setPosition(left: number, top: number) {
    this._top = top;
    this._left = left;

    this.cdr.detectChanges();
  }

  setWidth(width?: number) {
    this._width = width;
    this.cdr.detectChanges();
  }

  setMinWidth(minWidth?: number) {
    this._minWidth = minWidth;
    this.cdr.detectChanges();
  }

  public handleClickOuside(e: Event) {
    if (this.caller?.nativeElement.contains(e.target)) {
      e.stopPropagation();
    }
    if (this.popupVisible && !this.popup.nativeElement.contains(e.target)) {
      document.removeEventListener('mousedown', this.unlistenListener, { capture: true });
      this.unlistenListener = () => {};
      this.close();
    }
  }

  clickInside($event: PointerEvent) {
    this.close();
  }

  open() {
    this.popupVisible = true;
    this.cdr.detectChanges();
    this.renderer.setStyle(this.popup.nativeElement, 'left', `${this._left}px`);
    this.renderer.setStyle(this.popup.nativeElement, 'top', `${this._top}px`);
    if (this._width) {
      this.renderer.setStyle(this.popup.nativeElement, 'width', `${this._width}px`);
    }
    if (this._minWidth) {
      this.renderer.setStyle(this.popup.nativeElement, 'min-width', `${this._minWidth}px`);
    }
    this.checkOverflow();
    this.cdr.detectChanges();
    if (this.closeOnClickOutside) this.setOutsideClickHandler();
  }

  focus() {
    this.popup.nativeElement.children?.[0]?.focus();
  }

  blur() {
    this.popup.nativeElement.blur();
  }

  close() {
    this.popupVisible = false;
    this.caller?.nativeElement.focus();
    this.unlistenClick();
    this.unlistenClick = () => {};
    this.cdr.detectChanges();
  }

  toggle(el?: ElementRef, focus = true) {
    this.caller = el;
    if (this.popupVisible) {
      this.close();
      return;
    }
    this.open();
    if (focus) {
      this.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      this.close();
    }
  }

  private checkOverflow() {
    const bottomPoint = this.popup.nativeElement.offsetTop + this.popup.nativeElement.offsetHeight;
    if (bottomPoint > window.innerHeight) {
      this.renderer.setStyle(
        this.popup.nativeElement,
        'top',
        `${window.innerHeight - this.popup.nativeElement.offsetHeight - 32}px`,
      );
    }

    const rightPoint = this.popup.nativeElement.offsetLeft + this.popup.nativeElement.offsetWidth;
    if (rightPoint > window.innerWidth) {
      this.renderer.setStyle(
        this.popup.nativeElement,
        'left',
        `${window.innerWidth - this.popup.nativeElement.getBoundingClientRect().width - 40}px`,
      );
      this.renderer.setStyle(this.popup.nativeElement, 'right', `1rem`);
    }
  }

  private setOutsideClickHandler() {
    this.unlistenListener = this.handleClickOuside.bind(this);
    document.addEventListener('mousedown', this.unlistenListener, { capture: true });
  }
}
