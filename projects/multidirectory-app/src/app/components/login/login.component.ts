import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { Router } from "@angular/router";
import { MdFormComponent } from "projects/multidirectory-ui-kit/src/public-api";
import { Subject, takeUntil } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends MdFormComponent implements AfterViewInit, OnDestroy {
    login = '';
    password = '';

    constructor(private api: MultidirectoryApiService, private router: Router, cdr: ChangeDetectorRef) {
        super(cdr);
    }

    loginValid = false;
    override ngAfterViewInit(): void {
        super.ngAfterViewInit();
        this.valid.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(result => {
            this.loginValid = result;
        })
    }

    onLogin() {
        this.api.login(this.login, this.password).subscribe(response => {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            this.router.navigate(['/']);
        });
    }
}