import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { Router } from "@angular/router";
import { EMPTY, Subject, catchError, skipWhile, switchMap, take, takeUntil } from "rxjs";
import { MdFormComponent, MdModalComponent } from "multidirectory-ui-kit";
import {  ToastrService } from "ngx-toastr";
import { WebSocketService, WebsocketTokenHandle } from "../../core/websocket/websocket.service";
import { LoginResponse } from "../../models/login/login-response";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
    login = '';
    password = '';
    private unsubscribe = new Subject<void>();
    wssHandle?: WebsocketTokenHandle;
    @ViewChild('loginForm') loginForm!: MdFormComponent;
    @ViewChild('modal') modal!: MdModalComponent;

    constructor(
        private api: MultidirectoryApiService,
        private router: Router,
        private toastr: ToastrService,
        private wss: WebSocketService) {
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

    onLogin(event: Event) {
        event.preventDefault()
        event.stopPropagation();
        this.modal.showSpinner();
        this.api.login(this.login, this.password)
            .pipe(catchError((err, caught) => {
                this.modal.hideSpinner();
                if(err.status == 426) {
                    this.use2FA();
                    return EMPTY
                }
                this.toastr.error('Неверный логин или пароль');
                return EMPTY;
            }))
            .subscribe((response: LoginResponse) => {
                this.modal.hideSpinner();
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                this.router.navigate(['/']);
            });
    }

    private authComplete = new Subject<boolean>();
    use2FA() {
        let windowHandle: WindowProxy | null = null;
        this.wssHandle = this.wss.connect('multifactor/connect');
        this.wssHandle.inputRx.pipe(takeUntil(this.unsubscribe)).subscribe(x => {
            if(x.status == 'connected') {
                this.wssHandle?.send({
                    'username': 'adminlogin',
                    'password': '123123'
                });
            } else if(x.status == 'pending') {
                windowHandle = window.open(x.message, 'Auth', "height=630,width=630");
            } else if(x.status == 'success') {
                windowHandle?.close();
                console.log(x);
                this.authComplete.next(true);
                localStorage.setItem('access_token', x.message);
                localStorage.setItem('refresh_token', x.message);
                this.router.navigate(['/']);
            }
        });
        /** 
        this.wss.status.pipe(skipWhile(x => !x), take(1)).subscribe(_ => {
            this.wss.on<any>().subscribe(x => {
                console.log(x)
               
            });
        });
        */
        return this.authComplete.asObservable();
    }
}