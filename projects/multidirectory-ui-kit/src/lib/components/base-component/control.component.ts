import { Component, HostBinding } from '@angular/core';
import { IdProvider } from '../../utils/id-provider';

@Component({
  template: '',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { hostID: crypto.randomUUID().toString() },
})
export class BaseControlComponent {
  __ID = IdProvider.getUniqueId('base');
}
