import { AfterViewChecked, AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'md-portal',
  template: `<div [mdPortal]="tag"></div>`,
  styles: [],
})
export class MdPortalComponent {
  @Input() tag = 'portal';
}
