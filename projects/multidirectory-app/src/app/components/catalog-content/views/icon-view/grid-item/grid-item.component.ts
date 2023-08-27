import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ContextmenuType } from "@swimlane/ngx-datatable";
import { ContextMenuEvent } from "multidirectory-ui-kit";
import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { CdkDrag } from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-grid-item',
    styleUrls: ['./grid-item.component.scss'],
    templateUrl: 'grid-item.component.html'
})
export class GridItemComponent {
  @Input() big = false;
  @Input() item!: LdapEntity;
  @Output() clickOnItem = new EventEmitter<MouseEvent>;
  @Output() doubleClickOnItem = new EventEmitter<MouseEvent>;
  @Output() rightClick = new EventEmitter<ContextMenuEvent>;

  @ViewChild(CdkDrag) drag!: CdkDrag;
  draggable = {
      data: "myDragData",
      effectAllowed: 'copyMove',
      disable: false,
      handle: false
  };
  isSelected = false;
 
  onClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clickOnItem.next($event);
  }
  onDblClick($event: MouseEvent) {
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
      type: ContextmenuType.body
    });
  }
}