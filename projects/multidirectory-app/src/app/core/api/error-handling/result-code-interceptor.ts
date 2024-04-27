import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LdapCode } from './ldap-codes';
import { translate } from '@ngneat/transloco';

@Injectable()
export class ResultCodeInterceptor implements HttpInterceptor {
  messages = new Map<LdapCode, [number, string]>([
    [LdapCode.OPERATIONS_ERROR, [401, 'errors.forbidden']],
    [LdapCode.PROTOCOL_ERROR, [500, 'errors.filter-error']],
    [LdapCode.ENTRY_ALREADY_EXISTS, [422, 'errors.entry-already-exists']],
  ]);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((resp) => {
        if (resp.type !== HttpEventType.Response || !resp?.body?.resultCode) {
          return resp;
        }
        if (!!resp.body.errorMessage) {
          throw new HttpErrorResponse({
            status: resp.body.resultCode,
            statusText: resp.body.errorMessage,
          });
        }
        if (this.messages.has(resp.body.resultCode)) {
          const errData = this.messages.get(resp.body.resultCode)!;

          throw new HttpErrorResponse({ status: errData[0], statusText: translate(errData[1]) });
        }
        throw new HttpErrorResponse({ status: 500, statusText: translate('errors.unknown-error') });
      }),
    );
  }
}
