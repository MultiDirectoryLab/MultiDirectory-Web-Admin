import { Component, inject, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { MaxValueValidatorDirective } from '@core/validators/max-value.directive';
import { MinValueValidatorDirective } from '@core/validators/min-value.directive';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { DropdownOption, MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize } from 'rxjs';
import { PasswordsUploadComponent } from './passwords-upload/passwords-upload.component';

@Component({
  selector: 'app-password-policy',
  imports: [
    TranslocoPipe,
    RequiredWithMessageDirective,
    FormsModule,
    MultidirectoryUiKitModule,
    MinValueValidatorDirective,
    MaxValueValidatorDirective,
    RouterLink,
    PasswordsUploadComponent,
  ],
  templateUrl: './password-policy.component.html',
})
export class PasswordPolicyComponent implements OnInit {
  private readonly form = viewChild.required<MdFormComponent>('form');
  protected forbiddenPasswords?: File;
  protected passwordPolicy: WritableSignal<PasswordPolicy> = signal(new PasswordPolicy());
  protected languageOptions: DropdownOption[] = ['Latin', 'Cyrillic'].map((x) => new DropdownOption({ title: x, value: x }));
  protected scopeOptions: DropdownOption[] = [];

  private windows = inject(AppWindowsService);
  private api = inject(MultidirectoryApiService);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadPolicyFromRoute();
  }

  protected change(event: SubmitEvent) {
    this.stopSubmitEvent(event);
    this.form().validate();

    if (this.form().valid) {
      this.windows.showSpinner();

      this.loadForbiddenPasswords();

      this.api
        .savePasswordPolicy(this.passwordPolicy())
        .pipe(finalize(() => this.windows.hideSpinner()))
        .subscribe({
          next: () => {
            this.toastr.success(translate('password-policy.policy-updated-successfully'));
            this.router.navigate(['policies/password-policies']);
          },
          error: () => this.toastr.error(translate('password-policy.policy-update-error')),
        });
    }
  }

  private loadPasswordPolicy(id: string) {
    this.windows.showSpinner();

    this.api
      .getPasswordPolicy(id)
      .pipe(
        finalize(() => this.windows.hideSpinner()),
        catchError((err) => {
          this.windows.hideSpinner();
          this.toastr.error(translate('password-policy.policy-load-error'));
          throw err;
        }),
      )
      .subscribe((policy) => {
        this.passwordPolicy.set(policy);
        this.scopeOptions = policy.scopes.map((x) => new DropdownOption({ title: x, value: x }));
      });
  }

  private loadForbiddenPasswords() {
    if (this.forbiddenPasswords) {
      this.api.uploadForbiddenPasswords(this.forbiddenPasswords).subscribe({
        next: () => this.toastr.success(translate('passwords-upload.forbidden-passwords-uploaded-successfully')),
        error: () => this.toastr.error(translate('passwords-upload.forbidden-passwords-upload-error')),
      });
    }
  }

  private stopSubmitEvent(event: SubmitEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  private loadPolicyFromRoute() {
    const id: string | undefined = this.activatedRoute.snapshot.params['id'];

    if (id && id.trim() !== '') {
      this.loadPasswordPolicy(id);
    }
  }
}
