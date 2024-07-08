import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { Router } from '@angular/router';
import { EMPTY, Subject, catchError, skipWhile, switchMap, take, takeUntil } from 'rxjs';
import { MdFormComponent, MdModalComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService, WebsocketTokenHandle } from '@core/websocket/websocket.service';
import { LoginResponse } from '@models/login/login-response';
import { translate } from '@ngneat/transloco';
import { LoginService } from '@services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
    private loginService: LoginService,
  ) {}

  loginValid = false;
  ngAfterViewInit(): void {
    this.loginValid = this.loginForm.valid;
    this.loginForm.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      this.loginValid = result;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onLogin(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.modal.showSpinner();
    this.loginService
      .login(this.login, this.password)
      .pipe(
        catchError((err, caught) => {
          this.modal.hideSpinner();
          this.toastr.error(translate('login.wrong-login'));
          return EMPTY;
        }),
      )
      .subscribe((response: LoginResponse) => {
        this.modal.hideSpinner();
        this.router.navigate(['/']);
      });
  }
}
