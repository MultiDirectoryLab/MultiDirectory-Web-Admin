import {
  Component,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html',
  imports: [TranslocoPipe],
})
export class PasswordPolicyComponent implements OnChanges {
  readonly accessor = input.required<LdapAttributes>();

  protected policy: WritableSignal<PasswordPolicy | null> = signal(null);

  private readonly api = inject(MultidirectoryApiService);
  private readonly windows = inject(AppWindowsService);
  private readonly toastr = inject(ToastrService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accessor']) {
      this.getPolicy();
    }
  }

  private getPolicy() {
    const entityDn = this.accessor()['$entitydn']?.[0];

    if (entityDn) {
      this.windows.showSpinner();

      this.api
        .getPasswordPolicyByDirPath(entityDn)
        .pipe(finalize(() => this.windows.hideSpinner()))
        .subscribe({
          next: (policy) => this.policy.set(policy),
          error: (err) => {
            this.toastr.error(translate('password-policy.policy-get-error'));
            throw err;
          },
        });
    }
  }
}
