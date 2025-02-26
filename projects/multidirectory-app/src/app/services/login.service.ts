import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, Subject, take, tap } from 'rxjs';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { LoginResponse } from '@models/login/login-response';
import { translate } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authComplete = new Subject<boolean>();
  constructor(
    private api: MultidirectoryApiService,
    private toastr: ToastrService,
  ) {}

  use2FA(login: string, password: string) {
    this.api
      .getMultifactorACP(login, password)
      .pipe(take(1))
      .subscribe((resp) => {
        document.location = resp.message;
      });
    return this.authComplete.asObservable();
  }

  login(login: string, password: string): Observable<LoginResponse> {
    return this.api.login(login, password).pipe(
      catchError((err, caught) => {
        if (err.status == 426) {
          this.use2FA(login, password);
          return EMPTY;
        }
        this.toastr.error(translate('login.wrong-login'));
        throw err;
      }),
    );
  }
}
