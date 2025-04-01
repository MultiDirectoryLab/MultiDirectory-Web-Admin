import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@services/login.service';
import { MdFormComponent } from 'multidirectory-ui-kit';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { DialogComponent } from '../../components/modals/components/core/dialog/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private loginService = inject(LoginService);
  private unsubscribe = new Subject<void>();
  login = '';
  password = '';
  readonly loginForm = viewChild.required<MdFormComponent>('loginForm');
  readonly dialogComponent = viewChild.required<DialogComponent>(DialogComponent);
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
    this.dialogComponent().showSpinner();
    this.loginService
      .login(this.login, this.password)
      .pipe(
        catchError(() => {
          this.dialogComponent().hideSpinner();
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.dialogComponent().hideSpinner();
        this.router.navigate(['/']);
      });
  }
}
