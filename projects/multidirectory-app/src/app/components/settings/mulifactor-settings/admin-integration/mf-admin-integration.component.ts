import { Component, Input, OnInit } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { ToastrService } from "ngx-toastr";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { take } from "rxjs";

@Component({
    selector: 'app-mf-admin-integration',
    templateUrl: './mf-admin-integration.component.html',
    styleUrls: ['./mf-admin-integration.component.scss']
}) 
export class MfAdminIntegrationComponent {
    @Input() apiKey: string = '';
    @Input() apiSecret: string = '';

    constructor(private api: MultidirectoryApiService, private toastr: ToastrService) {}

    apply() {
        this.api.setupMultifactor(this.apiKey, this.apiSecret, false).subscribe(result => {
            if(result) {
                this.toastr.success(translate('mf-admin-integration.integration-success'));
            }
        })
    }
}