import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MdFormComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-mf-integration-form',
  templateUrl: './mf-integration-form.component.html',
  styleUrls: ['./mf-integration-form.component.scss'],
})
export class MfIntegrationFormComponent implements OnInit {
  @ViewChild('form') form!: MdFormComponent;
  @Input() scope: 'ldap' | 'http' = 'http';
  @Input() apiKey: string = '';
  @Input() apiSecret: string = '';
  translocoSection = 'multifactor-settings.mf-admin-integration';
  constructor(
    private api: MultidirectoryApiService,
    private windows: AppWindowsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    if (this.scope === 'ldap') {
      this.translocoSection = 'multifactor-settings.mf-user-integration';
    }
  }

  apply() {
    this.windows.showSpinner();
    this.api
      .setupMultifactor(this.apiKey, this.apiSecret, this.scope == 'ldap')
      .pipe(
        catchError((err) => {
          this.windows.hideSpinner();
          throw err;
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.toastr.success(translate(`${this.translocoSection}.integration-success`));
        }
        this.windows.hideSpinner();
      });
  }

  clear() {
    this.windows.showSpinner();
    this.api
      .clearMultifactor(this.scope)
      .pipe(
        catchError((err) => {
          this.windows.hideSpinner();
          throw err;
        }),
      )
      .subscribe(() => {
        this.toastr.success(translate(`${this.translocoSection}.clear-success`));
        this.apiKey = this.apiSecret = '';
        this.form.inputs.forEach((input) => input.reset());
        this.windows.hideSpinner();
      });
  }
}
