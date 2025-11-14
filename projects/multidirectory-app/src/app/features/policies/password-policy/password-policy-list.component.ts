import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '@core/constants';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordPolicyListItemComponent } from '@features/policies/password-policy/password-policy-list-item/password-policy-list-item.component';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs';
import { DialogType } from './password-policy/password-policy.component';

@Component({
  selector: 'app-password-policy-list',
  templateUrl: './password-policy-list.component.html',
  styleUrls: ['./password-policy-list.component.scss'],
  imports: [PasswordPolicyListItemComponent, TranslocoModule],
})
export class PasswordPolicyListComponent implements OnInit {
  protected policies: PasswordPolicy[] = [];
  protected defaultPolicy: PasswordPolicy | null = null;

  protected readonly dialogTypes = DialogType;

  private readonly api = inject(MultidirectoryApiService);
  private readonly router = inject(Router);
  private readonly windows = inject(AppWindowsService);
  private readonly toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getAllPolicies();
  }

  protected onDeleteClick(policy: PasswordPolicy) {
    this.api
      .deletePasswordPolicy(policy.id)
      .pipe(finalize(() => this.getAllPolicies()))
      .subscribe();
  }

  protected redirectToPolicyDialog(dialogType: DialogType, id?: number) {
    this.router.navigate(['policies/password-policies', id ?? ''], {
      state: { dialogType, defaultPolicy: this.defaultPolicy },
    });
  }

  private getAllPolicies() {
    this.windows.showSpinner();

    this.api
      .getAllPasswordPolicies()
      .pipe(
        catchError((err) => {
          this.toastr.error(translate('password-policy.policy-get-error'));
          throw err;
        }),
        finalize(() => this.windows.hideSpinner()),
      )
      .subscribe((policies) => {
        this.defaultPolicy =
          policies.find((policy) => policy.name === Constants.DefaultPolicyName) ?? null;
      });
  }
}
