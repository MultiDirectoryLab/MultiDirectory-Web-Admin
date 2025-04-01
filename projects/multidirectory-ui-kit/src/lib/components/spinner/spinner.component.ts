import { Component, Inject, Input, Optional } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseControlComponent } from '../base-component/control.component';
import { SPINNER_CONFIGUARTION, SpinnerConfiguration } from './spinner-options';
import { translate } from '@jsverse/transloco';

@Component({
  selector: 'md-spinner',
  styleUrls: ['./spinner.component.scss'],
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent extends BaseControlComponent {
  @Input() spinnerText = 'Please, wait...';
  @Input() name = 'primary';
  @Input() fullscreen = false;

  constructor(
    private spinner: NgxSpinnerService,
    @Optional() @Inject(SPINNER_CONFIGUARTION) configuration: SpinnerConfiguration,
  ) {
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
