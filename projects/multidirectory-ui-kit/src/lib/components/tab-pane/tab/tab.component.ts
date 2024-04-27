import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TabDirective } from '../tab.directive';

@Component({
  selector: 'md-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  @Input() el: HTMLElement | TabDirective | null = null;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<TabComponent>();
  handleClick($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
    this.isSelected = true;
    this.selected.emit(this);
  }
}
