import { AfterContentInit, Component } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterContentInit {
    login = '';
    password = '';
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService) {}

    ngAfterContentInit(): void {
    }

    onLogin() {
        this.api.login(this.login, this.password).subscribe(response => {
            console.log(response);
            this.toastr.success(response.access_token);
        });
    }
}