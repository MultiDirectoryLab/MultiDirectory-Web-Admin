import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, Subject, switchMap, take, tap } from 'rxjs';
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
    return this.api.getMultifactorACP(login, password).pipe(
      take(1),
      switchMap((resp) => {
        document.location = resp.message;
        return EMPTY;
      }),
    );
  }

  login(login: string, password: string): Observable<LoginResponse> {
    return this.api.login(login, password).pipe(
      catchError((err, caught) => {
        if (err.status == 426) {
          return this.use2FA(login, password);
        }
        this.toastr.error(translate('login.wrong-login'));
        throw err;
      }),
    );
  }
}
