import { Component, inject, Input } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { BaseControlComponent } from '../base-component/control.component';
import { SPINNER_CONFIGUARTION, SpinnerConfiguration } from './spinner-options';

@Component({
  selector: 'md-spinner',
  styleUrls: ['./spinner.component.scss'],
  templateUrl: './spinner.component.html',
  imports: [NgxSpinnerComponent],
})
export class SpinnerComponent extends BaseControlComponent {
  private spinner = inject(NgxSpinnerService);

  @Input() spinnerText = 'Please, wait...';
  @Input() name = 'primary';
  @Input() fullscreen = false;

  constructor() {
    let configuration = inject<SpinnerConfiguration>(SPINNER_CONFIGUARTION, { optional: true });

    if (!configuration) {
      configuration = new SpinnerConfiguration({ spinnerText: translate('spinner.please-wait') });
    }

    super();
    if (configuration.spinnerText) {
      this.spinnerText = configuration.spinnerText;
    }
  }

  show() {
    this.spinner.show(this.name);
  }

  hide() {
    this.spinner.hide(this.name);
  }
}
