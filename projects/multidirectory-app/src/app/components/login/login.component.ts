import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { Router } from "@angular/router";
import { EMPTY, Subject, catchError, takeUntil } from "rxjs";
import { MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import { Toast, ToastrService } from "ngx-toastr";

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
    @ViewChild('modal') modal!: MdModalComponent;

    constructor(private api: MultidirectoryApiService, private router: Router, private toastr: ToastrService) {
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
        this.modal.showSpinner();
        this.api.login(this.login, this.password)
            .pipe(catchError((err, caught) => {
                this.toastr.error('Неверный логин или пароль');
                this.modal.hideSpinner();
                return EMPTY;
            }))
            .subscribe(response => {
                this.modal.hideSpinner();
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                this.router.navigate(['/']);
            });
    }
}