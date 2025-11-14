import { Component, inject, input, output } from '@angular/core';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { translate } from '@jsverse/transloco';
import { PlaneButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-policy-list-item',
  templateUrl: './password-policy-list-item.component.html',
  styleUrls: ['./password-policy-list-item.component.scss'],
  imports: [PlaneButtonComponent],
})
export class PasswordPolicyListItemComponent {
  passwordPolicy = input<PasswordPolicy | null>(null);

  readonly editClick = output<PasswordPolicy>();

  private toastr = inject(ToastrService);

  protected onEditClick() {
    const policy = this.passwordPolicy();

    policy
      ? this.editClick.emit(policy)
      : this.toastr.error(translate('password-policy.client-does-not-exist'));
  }
}
