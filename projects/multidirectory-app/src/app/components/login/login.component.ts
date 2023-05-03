import { AfterContentInit, Component } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";
import { WhoamiResponse } from "../../models/whoami/whoami-response";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterContentInit {
    login = '';
    password = '';
    constructor(private api: MultidirectoryApiService, private router: Router) {}

    ngAfterContentInit(): void {
    }

    onLogin() {
        this.api.login(this.login, this.password).subscribe(response => {
            console.log(response);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            this.router.navigate(['/']);
        });
    }
}