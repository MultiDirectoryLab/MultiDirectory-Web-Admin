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

@Component({
  selector: 'md-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnDestroy {
  @Input() label = '';
  @Input() disabled = false;
  @Input() primary = false;
  @Output() click = new EventEmitter();
  unlistenClick = () => {};

  constructor(private el: ElementRef) {}

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
      this.click.next($event);
    }
  }
}
