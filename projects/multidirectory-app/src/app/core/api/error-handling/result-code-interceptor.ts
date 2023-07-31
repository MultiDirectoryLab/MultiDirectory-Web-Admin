import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { LdapCode } from "./ldap-codes";

@Injectable()
export class ResultCodeInterceptor implements HttpInterceptor {
    messages = new Map<LdapCode, [number, string]>([
        [LdapCode.OPERATIONS_ERROR, [401, 'Доступ запрещен']],
        [LdapCode.PROTOCOL_ERROR, [500, 'Ошибка фильтра']]
    ]);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(resp => {
                if(resp.type !== HttpEventType.Response || !resp?.body?.resultCode) {
                    return resp;
                }
                if(this.messages.has(resp.body.resultCode)) {
                    const errData = this.messages.get(resp.body.resultCode)!;
                    throw new HttpErrorResponse({ status: errData[0], statusText: errData[1]});
                }
                throw new HttpErrorResponse({ status: 500, statusText: 'Неизвестная ошибка'});
             })
        );
    }
    
}