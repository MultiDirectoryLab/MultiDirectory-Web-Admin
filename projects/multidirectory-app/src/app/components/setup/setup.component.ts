import { Component } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss']
})
export class SetupComponent {
    password = '';
    login = '';
    domain = '';
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService, private router: Router) {}

    onSetup() {
        this.api.setup({
            login: this.login,
            domain: this.domain,
            password: this.password
        }).subscribe(res => {
            this.toastr.success('Настройка выполнена');
            this.router.navigate(['/'])
        })
    }
}