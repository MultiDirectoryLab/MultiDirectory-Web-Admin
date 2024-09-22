import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseControlComponent } from '../base-component/control.component';

@Component({
  selector: 'md-spinner',
  styleUrls: ['./spinner.component.scss'],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent extends BaseControlComponent {
  @Input() spinnerText = 'Please, wait...';
  @Input() name = 'primary';
  @Input() fullscreen = false;

  constructor(private spinner: NgxSpinnerService) {
    super();
  }

  show() {
    this.spinner.show(this.name);
  }

  hide() {
    this.spinner.hide(this.name);
  }
}
