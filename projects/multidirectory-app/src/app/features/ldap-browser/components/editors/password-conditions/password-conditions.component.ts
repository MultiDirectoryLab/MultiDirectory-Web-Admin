import { Component, Input, OnInit, inject } from '@angular/core';
import { Constants } from '@core/constants';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppSettingsService } from '@services/app-settings.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Component({
  selector: 'app-password-conditions',
  templateUrl: './password-conditions.component.html',
  styleUrls: ['./password-conditions.component.scss'],
  imports: [TranslocoPipe],
})
export class PasswordConditionsComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  private app = inject(AppSettingsService);

  minimumPasswordLength = 7;
  passwordMustMeetComplexityRequirements = true;

  checkPasswordComplexity = false;
  checkPasswordMinimalLength = false;
  checkPasswordWithoutOtp = false;

  @Input() set currentPassword(password: string) {
    const hasUpperCase = /[A-ZА-Я]/.test(password);
    const hasLowerCase = /[a-zа-я]/.test(password);
    const hasNumbers = /\d/.test(password);
    const endsWith6Digits = /.*\d{6,}$/.test(password);

    this.checkPasswordComplexity = hasLowerCase && hasNumbers && hasUpperCase;
    this.checkPasswordMinimalLength = password?.length >= this.minimumPasswordLength;
    this.checkPasswordWithoutOtp = !endsWith6Digits;
  }

  ngOnInit(): void {
    if (this.app.userEntry) {
      this.api.getAllPasswordPolicies().subscribe((policies) => {
        const defaultPolicy = policies.find((x) => x.name === Constants.DefaultPolicyName);

        if (defaultPolicy) {
          this.minimumPasswordLength = defaultPolicy.minLength;
          this.passwordMustMeetComplexityRequirements = true;
        }
      });
    }
  }
}
