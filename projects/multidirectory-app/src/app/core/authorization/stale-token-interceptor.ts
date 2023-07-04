import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, retry, switchMap, tap } from "rxjs";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";

@Injectable()
export class StaleTokenInterceptor implements HttpInterceptor {
    constructor(private api: MultidirectoryApiService) {}

    exceptUrl = [
        'auth/token/get'
    ];
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status == 401 && !this.exceptUrl.some(url => err.url?.includes(url))) {
                        return this.api.refresh().pipe(
                            tap(response => {
                                localStorage.setItem('access_token', response.access_token);
                                localStorage.setItem('refresh_token', response.refresh_token);
                            }),
                            
                            switchMap(_ => next.handle(req))
                        );
                    }
                }    
                return next.handle(req); 
            })
        ); 
    }
}