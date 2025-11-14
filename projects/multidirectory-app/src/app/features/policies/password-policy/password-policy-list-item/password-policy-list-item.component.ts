import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, input, output } from '@angular/core';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { translate } from '@jsverse/transloco';
import { PlaneButtonComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-policy-list-item',
  templateUrl: './password-policy-list-item.component.html',
  styleUrls: ['./password-policy-list-item.component.scss'],
  imports: [NgOptimizedImage, PlaneButtonComponent],
})
export class PasswordPolicyListItemComponent {
  passwordPolicy = input<PasswordPolicy | null>(null);
  index = input(0);
  defaultPolicy = input(false);

  readonly deleteClick = output<PasswordPolicy>();
  readonly turnOffClick = output<PasswordPolicy>();
  readonly editClick = output<PasswordPolicy>();

  private readonly toastr = inject(ToastrService);

  protected onDeleteClick() {
    const policy = this.passwordPolicy();

    policy
      ? this.deleteClick.emit(policy)
      : this.toastr.error(translate('password-policy.client-does-not-exist'));
  }

  protected onEditClick() {
    const policy = this.passwordPolicy();

    policy
      ? this.editClick.emit(policy)
      : this.toastr.error(translate('password-policy.client-does-not-exist'));
  }
}
