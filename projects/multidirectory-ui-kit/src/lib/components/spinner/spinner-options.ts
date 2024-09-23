import { InjectionToken } from '@angular/core';

export class SpinnerConfiguration {
  spinnerText?: string;
  spinnerName?: string;

  constructor(obj: Partial<SpinnerConfiguration>) {
    Object.assign(this, obj);
  }
}
export const SPINNER_CONFIGUARTION = new InjectionToken<SpinnerConfiguration>(
  'Spinner Configuration',
);
