import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { Router } from "@angular/router";
import { MdFormComponent } from "multidirectory-ui-kit";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
    login = '';
    password = '';
    private unsubscribe = new Subject<void>();

    @ViewChild('loginForm') loginForm!: MdFormComponent;
    constructor(private api: MultidirectoryApiService, private router: Router) {
    }

    loginValid = false;
    ngAfterViewInit(): void {
        this.loginValid = this.loginForm.valid;
        this.loginForm.onValidChanges.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(result => {
            this.loginValid = result;
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onLogin() {
        this.api.login(this.login, this.password).subscribe(response => {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            this.router.navigate(['/']);
        });
    }
}