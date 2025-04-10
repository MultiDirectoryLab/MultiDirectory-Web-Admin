import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BaseControlComponent } from '../base-component/control.component';

@Component({
  selector: 'md-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [NgClass],
})
export class ButtonComponent extends BaseControlComponent implements OnInit, OnDestroy {
  @Input() label = '';
  @Input() disabled = false;
  @Input() primary = false;
  @Input() stretch = false;
  @Output() click = new EventEmitter();

  constructor(private el: ElementRef) {
    super();
  }

  unlistenClick = () => {};

  ngOnInit(): void {
    this.unlistenClick = this.el.nativeElement.addEventListener(
      'click',
      this.handleClickEvent.bind(this),
      true,
    );
  }

  handleClickEvent(event: any) {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.click.emit(event);
  }

  ngOnDestroy(): void {
    if (this.unlistenClick) {
      this.unlistenClick();
    }
  }

  onKeydown($event: KeyboardEvent) {
    if ($event.key == 'Enter' || $event.key == ' ') {
      $event.stopPropagation();
      $event.preventDefault();
      this.click.emit($event);
    }
  }
}
