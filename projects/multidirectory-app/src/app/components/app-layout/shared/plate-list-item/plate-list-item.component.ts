import { Component } from '@angular/core';

@Component({
  selector: 'app-plate-list-item',
  template: `
    <div class="plate-list-item">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .plate-list-item {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class PlateListItemComponent {}
