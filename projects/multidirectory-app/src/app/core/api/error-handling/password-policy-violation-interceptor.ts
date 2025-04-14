import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LdapCode } from './ldap-codes';
import { map, Observable } from 'rxjs';
import { translate } from '@jsverse/transloco';

@Injectable()
export class PasswordPolicyViolationInterceptor implements HttpInterceptor {
  messageToError = new Map<string, () => string>([
    ['password history violation', () => translate('error-message.password-history-violation')],
    [
      'password minimum length violation',
      () => translate('error-message.password-minimal-length-violation'),
    ],
    [
      'password complexity violation',
      () => translate('error-message.password-complexity-violation'),
    ],
    [
      'password cannot end with 6 digits',
      () => translate('error-message.password-cannot-end-with-digits-violation'),
    ],
  ]);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((resp) => {
        if (resp.type !== HttpEventType.Response || !resp?.body?.resultCode) {
          return resp;
        }

        if (
          resp?.body?.errorMessage?.includes('password') &&
          resp.body.resultCode == LdapCode.OPERATIONS_ERROR
        ) {
          const messages = (resp.body.errorMessage as string)
            .toLowerCase()
            .split(';')
            .map((x) => x.trim());

          const descriptions = messages.map((x) => this.messageToError.get(x)?.call(this) ?? '');

          throw {
            error: {
              detail: descriptions,
            },
          };
        }
        return resp;
      }),
    );
  }
}
