import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'md-multiselect-badge',
  templateUrl: './multiselect-badge.component.html',
  styleUrls: ['./multiselect-badge.component.scss'],
})
export class MultiselectBadgeComponent {
  @Output() badgeClose = new EventEmitter<void>();

  onClose() {
    this.badgeClose.next();
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.badgeClose.next();
      return;
    }
  }
}
