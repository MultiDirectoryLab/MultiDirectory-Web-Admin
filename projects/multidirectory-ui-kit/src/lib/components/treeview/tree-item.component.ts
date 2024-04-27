import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'md-tree-item',
  template: `<ng-content></ng-content>`,
})
export class TreeItemComponent {
  @Output() click = new EventEmitter();
}
