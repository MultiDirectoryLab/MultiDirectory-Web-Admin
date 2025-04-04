import { AfterViewChecked, AfterViewInit, Component, Input } from '@angular/core';
import { MdPortalDirective } from './portal.directive';

@Component({
  selector: 'md-portal',
  template: ` <div [mdPortal]="tag"></div>`,
  styles: [],
  imports: [MdPortalDirective],
})
export class MdPortalComponent {
  @Input() tag = 'portal';
}
