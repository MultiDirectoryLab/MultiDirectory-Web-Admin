import { Injectable, inject } from '@angular/core';
import { catchError, EMPTY, Observable, Subject, switchMap, take } from 'rxjs';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { LoginResponse } from '@models/api/login/login-response';
import { translate } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private api = inject(MultidirectoryApiService);
  private toastr = inject(ToastrService);

  private authComplete = new Subject<boolean>();

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
      catchError((err) => {
        if (err.status == 426) {
          return this.use2FA(login, password);
        }
        this.toastr.error(translate('login.wrong-login'));
        throw err;
      }),
    );
  }
}
