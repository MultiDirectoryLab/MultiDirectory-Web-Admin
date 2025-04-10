import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BaseControlComponent } from '../base-component/control.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'md-plane-button',
  templateUrl: './plane-button.component.html',
  styleUrls: ['./plane-button.component.scss'],
  imports: [NgClass],
})
export class PlaneButtonComponent extends BaseControlComponent implements AfterViewInit, OnDestroy {
  @Input() label = '';
  @Input() disabled = false;
  @Input() primary = false;
  @Input() hasBorder = false;
  @Input() isRow = false;
  @Input() rightBorder = false;
  @Output() click = new EventEmitter();
  unlistenClick = () => {};

  constructor(private el: ElementRef) {
    super();
  }

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
