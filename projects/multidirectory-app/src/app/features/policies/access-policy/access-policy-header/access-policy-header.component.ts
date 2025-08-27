import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-access-policy-header',
  templateUrl: './access-policy-header.component.html',
  styleUrls: ['./access-policy-header.component.scss'],
  imports: [TranslocoPipe],
})
export class AccessPolicyHeaderComponent {}
