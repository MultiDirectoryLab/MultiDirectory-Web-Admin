import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-password-policy-header',
  templateUrl: './password-policy-header.component.html',
  styleUrls: ['./password-policy-header.component.scss'],
  standalone: true,
  imports: [TranslocoPipe],
})
export class PasswordPolicyHeaderComponent {}
