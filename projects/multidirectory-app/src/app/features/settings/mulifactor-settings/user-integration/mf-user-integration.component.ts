import { Component, Input } from '@angular/core';
import { translate } from '@ngneat/transloco';
import { ToastrService } from 'ngx-toastr';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Component({
  selector: 'app-mf-user-integration',
  templateUrl: './mf-user-integration.component.html',
  styleUrls: ['./mf-user-integration.component.scss'],
})
export class MfUserIntegrationComponent {
  @Input() apiKey: string = '';
  @Input() apiSecret: string = '';

  constructor(
    private api: MultidirectoryApiService,
    private toastr: ToastrService,
  ) {}

  apply() {
    this.api.setupMultifactor(this.apiKey, this.apiSecret, true).subscribe((result) => {
      if (result) {
        this.toastr.success(
          translate('multifactor-settings.mf-user-integration.integration-success'),
        );
      }
    });
  }
}
