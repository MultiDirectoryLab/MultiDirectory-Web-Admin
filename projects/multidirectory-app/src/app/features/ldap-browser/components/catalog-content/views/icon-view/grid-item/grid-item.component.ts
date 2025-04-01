import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ContextmenuType } from 'ngx-datatable-gimefork';
import { ContextMenuEvent } from 'multidirectory-ui-kit';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-grid-item',
  styleUrls: ['./grid-item.component.scss'],
  templateUrl: 'grid-item.component.html',
  standalone: true,
  imports: [NgClass],
})
export class GridItemComponent {
  @Input() big = false;
  @Input() item!: LdapEntryNode;
  @Output() clickOnItem = new EventEmitter<MouseEvent>();
  @Output() doubleClickOnItem = new EventEmitter<Event>();
  @Output() rightClick = new EventEmitter<ContextMenuEvent>();

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
    this.rightClick.next({
      content: this.item,
      event: $event,
      type: ContextmenuType.body,
    });
  }
}
