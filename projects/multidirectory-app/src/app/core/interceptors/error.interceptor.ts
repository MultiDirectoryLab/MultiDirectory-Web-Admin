import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Observable, take, throwError } from 'rxjs';
import { AppSettingsService } from '@services/app-settings.service';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate } from '@jsverse/transloco';

export const ErrorCode = {
  BadRequest: 400,
  NotAuthorized: 401,
  UnprocessableEntity: 422,
  NotFound: 404,
  InternalServerError: 500,
};
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly toastr = inject(ToastrService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly router = inject(Router);
  private app: AppSettingsService = inject(AppSettingsService);
  private dialogService = inject(DialogService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.spinner.hide();
        if (error.status === ErrorCode.NotAuthorized) {
          return this.handle401(error);
        }
        if (
          error.status === ErrorCode.BadRequest ||
          error.status === ErrorCode.InternalServerError ||
          error.status === ErrorCode.UnprocessableEntity
        ) {
          const errText = this.parseBadRequestError(error);
          this.toastr.error(errText);
          return EMPTY;
        }
        return throwError(() => error.message);
      }),
    );
  }
  private parseBadRequestError(response: HttpErrorResponse): string {
    const errorCode = `${response.status}${response.error['domain_code']}${String(response.error['error_code']).padStart(2, '0')}`;
    const errorName = translate(`errors-code.${errorCode}`);
    if (errorName === `errors-code.${errorCode}`) {
      return response.error.detail ?? translate('errors.unknown-error');
    }

    return errorName;
  }

  private handle401(error: HttpErrorResponse) {
    this.dialogService.closeAll();

    const isAuthCheck = error?.url?.includes('/auth/me');
    if (!isAuthCheck) {
      const errText = this.parseBadRequestError(error);
      this.toastr.info(errText);
    }

    const userAbsent = Object.keys(this.app.user).length === 0;

    if (!window.location.href.includes('/login') && userAbsent) {
      this.app
        .logout()
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['login']);
        });
      return EMPTY;
    }
    return throwError(() => error);
  }
}
