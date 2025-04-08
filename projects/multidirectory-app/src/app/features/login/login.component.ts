import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { WebsocketTokenHandle } from '@core/websocket/websocket.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoginResponse } from '@models/login/login-response';
import { LoginService } from '@services/login.service';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  MdFormComponent,
  MdModalComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MdModalComponent,
    MdFormComponent,
    TextboxComponent,
    RequiredWithMessageDirective,
    FormsModule,
    TranslocoPipe,
    ButtonComponent,
  ],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private api = inject(MultidirectoryApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private loginService = inject(LoginService);
  private unsubscribe = new Subject<void>();
  login = '';
  password = '';
  wssHandle?: WebsocketTokenHandle;
  readonly loginForm = viewChild.required<MdFormComponent>('loginForm');
  readonly modal = viewChild.required<MdModalComponent>('modal');
  loginValid = false;

  ngAfterViewInit(): void {
    this.loginValid = this.loginForm().valid;
    this.loginForm()
      .onValidChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((result) => {
        this.loginValid = result;
        this.cdr.detectChanges();
      });
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onLogin(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.modal().showSpinner();
    this.loginService
      .login(this.login, this.password)
      .pipe(
        catchError((err, caught) => {
          this.modal().hideSpinner();
          return EMPTY;
        }),
      )
      .subscribe((response: LoginResponse) => {
        this.modal().hideSpinner();
        this.router.navigate(['/']);
      });
  }
}
