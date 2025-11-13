import {
  ChangeDetectionStrategy,
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
import { DropdownContainerDirective } from './dropdown-container.directive';

@Component({
  selector: 'md-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  @Input() items!: any[];
  @Input() direction: 'up' | 'right' = 'right';
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() container?: DropdownContainerDirective;
  _top: number = 0;
  _left: number = 0;
  _width?: number;
  _minWidth?: number;
  _maxHeight?: number;

  @ViewChild('menu') menu!: ElementRef;
  caller?: ElementRef;
  dropdownVisible = false;
  unlistenClick = () => {};
  unlistenListener = (e: Event) => {};

  setPosition(left: number, top: number) {
    this._top = top;
    this._left = left;
  }

  setWidth(width?: number) {
    this._width = width;
    this.cdr.detectChanges();
  }

  setMinWidth(minWidth?: number) {
    this._minWidth = minWidth;
    this.cdr.detectChanges();
  }

  setMaxHeight(maxHeight?: number) {
    this._maxHeight = maxHeight;
    this.cdr.detectChanges();
  }

  handleClickOuside(e: Event) {
    if (this.caller?.nativeElement.contains(e.target)) {
      e.stopPropagation();
    }
    if (this.dropdownVisible && !this.menu.nativeElement.contains(e.target)) {
      document.removeEventListener('mousedown', this.unlistenListener, { capture: true });
      this.unlistenListener = () => {};
      this.close();
    }
  }

  clickInside($event: PointerEvent) {
    this.close();
  }

  open(calculatePosition = false) {
    this.dropdownVisible = true;
    this.cdr.detectChanges();
    if (calculatePosition) {
      this.renderer.setStyle(this.menu.nativeElement, 'left', `${this._left}px`);
      this.renderer.setStyle(this.menu.nativeElement, 'top', `${this._top}px`);
    }
    if (this._width) {
      this.renderer.setStyle(this.menu.nativeElement, 'width', `${this._width}px`);
    }
    if (this._minWidth) {
      this.renderer.setStyle(this.menu.nativeElement, 'min-width', `${this._minWidth}px`);
    }
    if (this._maxHeight) {
      this.renderer.setStyle(this.menu.nativeElement, 'max-height', `${this._maxHeight}px`);
    }

    setTimeout(() => {
      this.checkOverflow();
      this.cdr.detectChanges();
    }, 0);

    this.setOutsideClickHandler();
  }

  focus() {
    this.menu.nativeElement.children?.[0]?.focus();
  }

  blur() {
    this.menu.nativeElement.blur();
  }

  close() {
    this.dropdownVisible = false;
    this.caller?.nativeElement.focus();
    this.unlistenClick();
    this.unlistenClick = () => {};
    this.cdr.detectChanges();
  }

  toggle(el?: ElementRef, focus = true, calculatePosition = false) {
    this.caller = el;
    if (this.dropdownVisible) {
      this.close();
      return;
    }
    this.open(calculatePosition);
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
    const menuElement = this.menu.nativeElement;
    const rect = menuElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom > viewportHeight) {
      const availableHeight = viewportHeight - rect.top - 16;

      if (availableHeight > 0) {
        this.renderer.setStyle(menuElement, 'max-height', `${availableHeight}px`);
      } else {
        const maxHeight = viewportHeight - 32;

        this.renderer.setStyle(menuElement, 'top', '16px');
        this.renderer.setStyle(menuElement, 'max-height', `${maxHeight}px`);
      }
    } else {
      if (this._maxHeight && !this._maxHeight) {
        this.renderer.removeStyle(menuElement, 'max-height');
      }
    }

    const viewportWidth = window.innerWidth;

    if (rect.right > viewportWidth) {
      this.renderer.setStyle(menuElement, 'left', `${viewportWidth - rect.width - 40}px`);
      this.renderer.setStyle(menuElement, 'right', `1rem`);
    }
  }

  private setOutsideClickHandler() {
    this.unlistenListener = this.handleClickOuside.bind(this);
    document.addEventListener('mousedown', this.unlistenListener, { capture: true });
  }
}
