import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { BaseControlComponent } from '../base-component/control.component';

@Component({
  selector: 'md-plane-button',
  templateUrl: './plane-button.component.html',
  styleUrls: ['./plane-button.component.scss'],
  imports: [NgClass],
})
export class PlaneButtonComponent extends BaseControlComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);

  @Input() label = '';
  @Input() disabled = false;
  @Input() primary = false;
  @Input() hasBorder = false;
  @Input() isRow = false;
  @Input() rightBorder = false;
  @Output() click = new EventEmitter();

  constructor() {
    super();
  }

  unlistenClick = () => {};

  ngAfterViewInit(): void {
    this.unlistenClick = this.el.nativeElement.addEventListener(
      'click',
      (event: any) => {
        event.stopPropagation();
        if (this.disabled) {
          return;
        }
        this.click.emit(event);
      },
      true,
    );
  }

  ngOnDestroy(): void {
    if (this.unlistenClick) {
      this.unlistenClick();
    }
  }
}
