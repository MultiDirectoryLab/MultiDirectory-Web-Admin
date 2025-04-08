import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  CheckboxComponent,
  GroupComponent,
  MdFormComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html',
  styleUrls: ['./password-policy.component.scss'],
  imports: [
    MdFormComponent,
    TranslocoPipe,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    GroupComponent,
    CheckboxComponent,
    ButtonComponent,
  ],
})
export class PasswordPolicyComponent implements OnInit {
  @ViewChild('form') form!: MdFormComponent;
  passwordPolicy = new PasswordPolicy();

  constructor(
    private activatedRoute: ActivatedRoute,
    private windows: AppWindowsService,
    private api: MultidirectoryApiService,
    private app: AppSettingsService,
  ) {}

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot.params['id'];
    this.windows.showSpinner();
    this.api.getPasswordPolicy().subscribe({
      next: (x) => {
        this.passwordPolicy = x;
        this.windows.hideSpinner();
      },
      error: (err) => {
        this.windows.hideSpinner();
      },
    });
  }

  close() {}

  save() {
    this.app.validatePasswords = this.passwordPolicy.passwordMustMeetComplexityRequirements;
    this.form.validate();
    this.windows.showSpinner();
    this.api.savePasswordPolicy(this.passwordPolicy).subscribe({
      complete: () => {
        this.windows.hideSpinner();
      },
    });
  }
}
