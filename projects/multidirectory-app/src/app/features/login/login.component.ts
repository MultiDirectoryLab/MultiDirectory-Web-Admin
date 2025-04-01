import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { WebsocketTokenHandle } from '@core/websocket/websocket.service';
import { LoginResponse } from '@models/login/login-response';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoginService } from '@services/login.service';
import { DialogComponent } from '../../components/modals/components/core/dialog/dialog.component';

import { FormsModule } from '@angular/forms';
import { RequiredWithMessageDirective } from '../../core/validators/required-with-message.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    FormsModule,
    DialogComponent,
  ],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  login = '';
  password = '';
  wssHandle?: WebsocketTokenHandle;
  @ViewChild('loginForm') loginForm!: MdFormComponent;
  @ViewChild(DialogComponent) dialogComponent!: DialogComponent;
  loginValid = false;
  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
  ) {}

  ngAfterViewInit(): void {
    this.loginValid = this.loginForm.valid;
    this.loginForm.onValidChanges.pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
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
    this.dialogComponent.showSpinner();
    this.loginService
      .login(this.login, this.password)
      .pipe(
        catchError((err, caught) => {
          this.dialogComponent.hideSpinner();
          return EMPTY;
        }),
      )
      .subscribe((response: LoginResponse) => {
        this.dialogComponent.hideSpinner();
        this.router.navigate(['/']);
      });
  }
}
