import { Component, EventEmitter, Output } from '@angular/core';
import { BaseControlComponent } from '../base-component/control.component';

@Component({
  selector: 'md-tree-item',
  template: `<ng-content></ng-content>`,
})
export class TreeItemComponent extends BaseControlComponent {
  @Output() click = new EventEmitter();
}
