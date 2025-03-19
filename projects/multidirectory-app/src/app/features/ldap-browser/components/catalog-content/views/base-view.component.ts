import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RightClickEvent } from '@models/core/context-menu/right-click-event';
import { NavigationNode } from '@models/core/navigation/navigation-node';

@Component({
  selector: 'app-base-view',
  template: '',
})
export abstract class BaseViewComponent {
  @Input() selectedCatalog: NavigationNode | null = null;
  @Output() rightClick = new EventEmitter<RightClickEvent>();

  handleRightClick(event: any) {
    let selected = this.getSelected();
    if (!!event.content?.entry && !selected.includes(event.content?.entry)) {
      this.setSelected([event.content?.entry]);
    }
    if (event instanceof PointerEvent) {
      event.preventDefault();
      event.stopPropagation();
    }
    selected = this.getSelected();
    if (!selected || selected.length == 0) {
      return;
    }
    this.rightClick.emit({
      pointerEvent: event instanceof PointerEvent ? event : event.event,
      selected: this.getSelected(),
    });
  }

  abstract updateContent(): void;
  abstract getSelected(): NavigationNode[];
  abstract setSelected(selected: NavigationNode[]): void;

  setCatalog(catalog: NavigationNode): void {
    this.selectedCatalog = catalog;
  }
}
