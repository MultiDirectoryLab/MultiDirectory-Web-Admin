import { Component } from '@angular/core';

@Component({
  selector: 'app-popup-base',
  template: `
    <div style="height: 320px;">
      <md-popup-suggest #menuRef [closeOnClickOutside]="false">
        @for (checkbox of checkboxes; track checkbox) {
          <div>
            @if (checkbox.state) {
              <span>V</span>
            }
            @if (!checkbox.state) {
              <span>X</span>
            }
            <span> {{ checkbox.name }}</span>
          </div>
        }
      </md-popup-suggest>
      <md-button (click)="handleClick()">Add</md-button>
      <md-button [mdPopupContainer]="menuRef" [direction]="'right'">Open</md-button>
    </div>
  `,
})
export class PopupTestComponent {
  checkboxes: CheckboxState[] = [{ name: 'Item', state: false }];
  handleClick() {
    this.checkboxes.forEach((x) => (x.state = true));
    this.checkboxes.push({ name: 'Item', state: false });
  }
}

interface CheckboxState {
  name: string;
  state: boolean;
}
