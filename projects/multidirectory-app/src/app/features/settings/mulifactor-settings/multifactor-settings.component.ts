import { Component, OnInit, inject } from '@angular/core';
import { MfIntegrationFormComponent } from '@features/settings/mulifactor-settings/mf-integration-form/mf-integration-form.component';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-multifactor-settings',
  templateUrl: './multifactor-settings.component.html',
  styleUrls: ['./multifactor-settings.component.scss'],
  imports: [MfIntegrationFormComponent],
})
export class MultifactorSettingsComponent implements OnInit {
  private api = inject(MultidirectoryApiService);

  apiKey = '';
  apiSecret = '';
  ldapApiKey = '';
  ldapApiSecret = '';

  ngOnInit(): void {
    this.api
      .getMultifactor()
      .pipe(take(1))
      .subscribe((result) => {
        this.apiKey = result.mfa_key;
        this.apiSecret = result.mfa_secret;
        this.ldapApiKey = result.mfa_key_ldap;
        this.ldapApiSecret = result.mfa_secret_ldap;
      });
  }
}
