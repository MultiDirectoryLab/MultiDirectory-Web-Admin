import { Component, OnInit } from "@angular/core";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

@Component({
    selector: 'app-multifactor-settings',
    templateUrl: './multifactor-settings.component.html',
    styleUrls: ['./multifactor-settings.component.scss']
})
export class MultifactorSettingsComponent implements OnInit {
    apiKey = '';
    apiSecret = '';
    ldapApiKey = '';
    ldapApiSecret = '';
    
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService) {}
    ngOnInit(): void {
        this.api.getMultifactor().pipe(take(1)).subscribe(result => {
            this.apiKey = result.mfa_key;
            this.apiSecret = result.mfa_secret;
            this.ldapApiKey = result.mfa_key_ldap;
            this.ldapApiSecret = result.mfa_secret_ldap;
        });
    }
}