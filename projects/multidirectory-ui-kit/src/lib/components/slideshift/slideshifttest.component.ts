import { Component, ElementRef, ViewChild } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slideshift-test',
  template: `
    <md-button type="button" (click)="open()">Click me</md-button>
    <md-slideshift [showSlideshift]="showSlideshift">
      <div style="min-width: 300px;">
        <md-button (click)="gotcha()">click me</md-button>
      </div>
    </md-slideshift>
  `,
})
export class SlideshiftTestComponent {
  @ViewChild('closeButton', { static: true }) closeButton?: ElementRef<HTMLButtonElement>;
  showSlideshift = false;

  open() {
    this.showSlideshift = true;
    setTimeout(() => {
      this.showSlideshift = false;
    }, 125000);
  }

  close() {
    this.showSlideshift = false;
  }

  gotcha() {
    alert('test');
  }
}
