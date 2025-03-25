import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ContextmenuType } from 'ngx-datatable-gimefork';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { RightClickEvent } from '@models/core/context-menu/right-click-event';

@Component({
  selector: 'app-grid-item',
  styleUrls: ['./grid-item.component.scss'],
  templateUrl: 'grid-item.component.html',
})
export class GridItemComponent {
  @Input() big = false;
  @Input() item!: NavigationNode;
  @Output() clickOnItem = new EventEmitter<MouseEvent>();
  @Output() doubleClickOnItem = new EventEmitter<Event>();
  @Output() rightClick = new EventEmitter<RightClickEvent>();

  @ViewChild(CdkDrag) drag!: CdkDrag;
  draggable = {
    data: 'myDragData',
    effectAllowed: 'copyMove',
    disable: false,
    handle: false,
  };
  isSelected = false;

  onClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clickOnItem.next($event);
  }
  onDblClick($event: Event) {
    $event.preventDefault();
    this.item.selected = false;
    this.doubleClickOnItem.next($event);
  }

  onRightClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clickOnItem.next($event);
  }
}
