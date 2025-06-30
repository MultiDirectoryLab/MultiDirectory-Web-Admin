import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
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
  private el = inject(ElementRef);

  @Input() label = '';
  @Input() disabled = false;
  @Input() primary = false;
  @Input() stretch = false;
  @Input() submit = false;
  @Output() click = new EventEmitter();

  constructor() {
    super();
  }

  unlistenClick = () => {};

  ngOnInit(): void {
    if (this.submit) {
      return;
    }
    this.unlistenClick = this.el.nativeElement.addEventListener(
      'click',
      this.handleClickEvent.bind(this),
      true,
    );
  }

  handleClickEvent(event: any) {
    event.preventDefault();
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
