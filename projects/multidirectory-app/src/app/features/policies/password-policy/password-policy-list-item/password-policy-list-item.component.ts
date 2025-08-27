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
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  readonly index = input(0);
  readonly deleteClick = output<PasswordPolicy>();
  readonly turnOffClick = output<PasswordPolicy>();
  readonly editClick = output<PasswordPolicy>();

  _passwordPolicy: PasswordPolicy | null = null;

  get passwordPolicy(): PasswordPolicy | null {
    return this._passwordPolicy;
  }

  @Input() set passwordPolicy(passwordPolicy: PasswordPolicy | null) {
    this._passwordPolicy = passwordPolicy;
  }

  onDeleteClick() {
    if (!this.passwordPolicy) {
      this.toastr.error(translate('password-policy.client-does-not-exist'));
      return;
    }
    this.deleteClick.emit(this.passwordPolicy);
  }

  onEditClick() {
    if (!this.passwordPolicy) {
      this.toastr.error(translate('password-policy.client-does-not-exist'));
      return;
    }
    this.editClick.emit(this.passwordPolicy);
    this.cdr.detectChanges();
  }
}
