import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { PasswordPolicy } from '@core/password-policy/password-policy';

@Component({
  selector: 'app-password-policy-list-item',
  templateUrl: './password-policy-list-item.component.html',
  styleUrls: ['./password-policy-list-item.component.scss'],
})
export class PasswordPolicyListItemComponent {
  @Input() index = 0;
  @Output() deleteClick = new EventEmitter<PasswordPolicy>();
  @Output() turnOffClick = new EventEmitter<PasswordPolicy>();
  @Output() editClick = new EventEmitter<PasswordPolicy>();

  _passwordPolicy: PasswordPolicy | null = null;
  get passwordPolicy(): PasswordPolicy | null {
    return this._passwordPolicy;
  }
  @Input() set passwordPolicy(passwordPolicy: PasswordPolicy | null) {
    this._passwordPolicy = passwordPolicy;
  }
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {}

  onDeleteClick() {
    if (!this.passwordPolicy) {
      this.toastr.error(translate('password-policy.client-does-not-exist'));
      return;
    }
    this.deleteClick.emit(this.passwordPolicy);
  }

  onTurnOffClick() {
    if (!this.passwordPolicy) {
      this.toastr.error(translate('password-policy.client-does-not-exist'));
      return;
    }
    this.turnOffClick.emit(this.passwordPolicy);
    this.cdr.detectChanges();
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
