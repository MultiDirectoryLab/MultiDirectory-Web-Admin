import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { Component, input, output, viewChild } from '@angular/core';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { ContextmenuType } from 'ngx-datatable-gimefork';
import { ContextMenuEvent } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-grid-item',
  styleUrls: ['./grid-item.component.scss'],
  templateUrl: 'grid-item.component.html',
  imports: [NgClass],
})
export class GridItemComponent {
  readonly big = input(false);
  readonly item = input.required<NavigationNode>();
  readonly clickOnItem = output<MouseEvent>();
  readonly doubleClickOnItem = output<Event>();
  readonly rightClick = output<ContextMenuEvent>();

  readonly drag = viewChild.required(CdkDrag);

  onClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clickOnItem.emit($event);
  }

  onDblClick($event: Event) {
    $event.preventDefault();
    this.item().selected = false;
    this.doubleClickOnItem.emit($event);
  }

  onRightClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clickOnItem.emit($event);
    this.rightClick.emit({
      content: this.item(),
      event: $event,
      type: ContextmenuType.body,
    });
  }
}
