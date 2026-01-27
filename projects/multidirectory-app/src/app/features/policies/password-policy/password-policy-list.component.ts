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

@Component({
  selector: 'app-password-policy-list',
  templateUrl: './password-policy-list.component.html',
  styleUrls: ['./password-policy-list.component.scss'],
  imports: [PasswordPolicyListItemComponent, TranslocoModule],
})
export class PasswordPolicyListComponent implements OnInit {
  protected policies: PasswordPolicy[] = [];
  protected defaultPolicy: PasswordPolicy | null = null;

  private api = inject(MultidirectoryApiService);
  private router = inject(Router);
  private windows = inject(AppWindowsService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getAllPolicies();
  }

  protected redirectToPolicyDialog(id?: number) {
    this.router.navigate(['policies/password-policies', id ?? ''], {
      state: { defaultPolicy: this.defaultPolicy },
    });
  }

  private getAllPolicies() {
    this.windows.showSpinner();

    this.api
      .getAllPasswordPolicies()
      .pipe(finalize(() => this.windows.hideSpinner()))
      .subscribe((policies) => {
        this.defaultPolicy = policies.find((policy) => policy.name === Constants.DefaultPolicyName) ?? null;
      });
  }
}
