import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EMPTY, Observable, catchError, retry, throwError } from "rxjs";
import { AdapterSettings } from "./adapter-settings";
import { ToastrService } from "ngx-toastr";
// 
export class ApiAdapter<Settings extends AdapterSettings> {

    constructor(private httpClient: HttpClient, private _settings: Settings, private toastr: ToastrService) {}

    post<T>(resource: string, body: any = null, ): PostRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new PostRequest<T>(url, body, this.httpClient, this.toastr);
    }

    delete<T>(resource: string, body: any = null, ): DeleteRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new DeleteRequest<T>(url, body, this.httpClient, this.toastr);
    }

    get<T>(resource: string): GetRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new GetRequest<T>(url, this.httpClient, this.toastr);
    }
}

export abstract class HttpRequest<ResponseType> {
    httpOptions = {
        headers: new HttpHeaders()
    };
    
    constructor(protected url: string, protected httpClient: HttpClient, protected toastr: ToastrService) {
    }

    ensureBearer(): HttpRequest<ResponseType> {
        const token = localStorage.getItem('access_token');
        if(token) {
            this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
        }
        return this;
    }

    refreshToken(): HttpRequest<ResponseType> {
        const token = localStorage.getItem('refresh_token');
        if(token) {
            this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
        }
        return this;
    }


    handleError(err: any) {
       // this.toastr.error(err.statusText);
        return throwError(() => err);
    }

    abstract execute(): Observable<ResponseType>;
    
}

export class PostRequest<ResponseType> extends HttpRequest<ResponseType>{
    constructor(url: string, private body: any, httpClient: HttpClient, toastr: ToastrService) {
        super(url, httpClient, toastr);
    }

    useUrlEncodedForm(): PostRequest<ResponseType> {
        this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', `application/x-www-form-urlencoded`);
        return this;
    }

    override execute(): Observable<ResponseType> {
        return this.httpClient.post<ResponseType>(this.url, this.body, this.httpOptions).pipe(
            catchError(this.handleError.bind(this))
        );
    }

}


export class GetRequest<ResponseType> extends HttpRequest<ResponseType> {
    constructor(url: string, httpClient: HttpClient, toastr: ToastrService) {
        super(url, httpClient, toastr);
    } 

    override execute(): Observable<ResponseType> {
        return this.httpClient.get<ResponseType>(this.url, this.httpOptions).pipe(
            catchError(this.handleError.bind(this))
        );
    }
}


export class DeleteRequest<ResponseType> extends HttpRequest<ResponseType>{
    constructor(url: string, private body: any, httpClient: HttpClient, toastr: ToastrService) {
        super(url, httpClient, toastr);
    }

    useUrlEncodedForm(): DeleteRequest<ResponseType> {
        this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', `application/x-www-form-urlencoded`);
        return this;
    }

    override execute(): Observable<ResponseType> {
        return this.httpClient.delete<ResponseType>(this.url, {
            headers: this.httpOptions.headers, 
            body: this.body
        }).pipe(
            catchError(this.handleError.bind(this))
        );
    }

}