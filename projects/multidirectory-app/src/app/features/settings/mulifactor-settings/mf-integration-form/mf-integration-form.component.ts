import { Component, inject, Input, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MfKeyValidatorDirective } from '@core/validators/mf-keys-validator.directive';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import { AppWindowsService } from '@services/app-windows.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  MdFormComponent,
  TextboxComponent,
  TooltipComponent,
} from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-mf-integration-form',
  templateUrl: './mf-integration-form.component.html',
  styleUrls: ['./mf-integration-form.component.scss'],
  imports: [
    TranslocoDirective,
    MdFormComponent,
    TooltipComponent,
    TextboxComponent,
    FormsModule,
    MfKeyValidatorDirective,
    ButtonComponent,
  ],
})
export class MfIntegrationFormComponent implements OnInit {
  private api = inject(MultidirectoryApiService);
  private windows = inject(AppWindowsService);
  private toastr = inject(ToastrService);

  readonly form = viewChild.required<MdFormComponent>('form');
  @Input() scope: 'ldap' | 'http' = 'http';
  @Input() apiKey: string = '';
  @Input() apiSecret: string = '';
  translocoSection = 'multifactor-settings.mf-admin-integration';

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
        this.form().inputs.forEach((input) => input.reset());
        this.windows.hideSpinner();
      });
  }
}
