import { Component, ElementRef, inject, OnDestroy, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoginService } from '@services/login.service';
import { ButtonComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { catchError, Subject } from 'rxjs';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { DIALOG_COMPONENT_WRAPPER_CONFIG } from '@components/modals/constants/dialog.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    DialogComponent,
    TextboxComponent,
    FormsModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: DIALOG_COMPONENT_WRAPPER_CONFIG,
      useValue: {
        closable: false,
        draggable: false,
      },
    },
  ],
})
export class LoginComponent implements OnDestroy {
  private router = inject(Router);
  private loginService = inject(LoginService);
  private unsubscribe = new Subject<void>();
  protected cdr = inject(ChangeDetectorRef);
  username = '';
  password = '';
  readonly dialogComponent = viewChild.required<DialogComponent>(DialogComponent);
  loginForm: FormGroup;
  isFirstLoad: boolean = true;
  isValid: boolean = false;
  autoFilled: { allAutoFilled: boolean; fields: { [key: string]: boolean } } = {
    fields: { username: false, password: false },
    allAutoFilled: false,
  };
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.loginForm.valueChanges.subscribe((data) => {
      this.checkValid();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setaAutofilledValue(name: string, event: boolean) {
    this.autoFilled.fields[name] = event;
    this.autoFilled.allAutoFilled = Object.values(this.autoFilled.fields).reduce((acc, curr) => acc && curr, true);
    this.loginForm.markAsTouched();
    if (name === 'password') {
      this.checkValid();
    }
  }

  checkValid() {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.isValid = !(this.loginForm.valid || this.autoFilled.allAutoFilled);
    } else {
      this.isValid = !this.loginForm.valid;
    }
    this.cdr.detectChanges();
  }

  onLogin(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.loginForm.valid) {
      this.dialogComponent().showSpinner();
      this.loginService
        .login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value)
        .pipe(
          catchError((err) => {
            this.dialogComponent().hideSpinner();
            throw err;
          }),
        )
        .subscribe(() => {
          this.dialogComponent().hideSpinner();
          this.router.navigate(['/']);
        });
    }
  }
}
