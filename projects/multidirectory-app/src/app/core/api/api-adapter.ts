import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { AdapterSettings } from "./adapter-settings";
// 
export class ApiAdapter<Settings extends AdapterSettings> {

    constructor(private httpClient: HttpClient, private _settings: Settings) {}

    post<T>(resource: string, body: any = null, ): PostRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new PostRequest<T>(url, body, this.httpClient);
    }

    delete<T>(resource: string, body: any = null, ): DeleteRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new DeleteRequest<T>(url, body, this.httpClient);
    }

    get<T>(resource: string): GetRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new GetRequest<T>(url, this.httpClient);
    }
}

export abstract class HttpRequest<ResponseType> {
    httpOptions = {
        headers: new HttpHeaders()
    };
    
    constructor(protected url: string, protected httpClient: HttpClient) {
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

    protected handleError(error: HttpErrorResponse) {
        console.log('hjandling')
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }
      
      
    abstract execute(): Observable<ResponseType>;
}

export class PostRequest<ResponseType> extends HttpRequest<ResponseType>{
    constructor(url: string, private body: any, httpClient: HttpClient) {
        super(url, httpClient);
    }

    useUrlEncodedForm(): PostRequest<ResponseType> {
        this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', `application/x-www-form-urlencoded`);
        return this;
    }

    override execute(): Observable<ResponseType> {
        return this.httpClient.post<ResponseType>(this.url, this.body, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

}


export class GetRequest<ResponseType> extends HttpRequest<ResponseType> {
    constructor(url: string, httpClient: HttpClient) {
        super(url, httpClient);
    } 

    override execute(): Observable<ResponseType> {
        return this.httpClient.get<ResponseType>(this.url, this.httpOptions)
            .pipe(catchError(this.handleError));
    }
}


export class DeleteRequest<ResponseType> extends HttpRequest<ResponseType>{
    constructor(url: string, private body: any, httpClient: HttpClient) {
        super(url, httpClient);
    }

    useUrlEncodedForm(): DeleteRequest<ResponseType> {
        this.httpOptions.headers = this.httpOptions.headers.set('Content-Type', `application/x-www-form-urlencoded`);
        return this;
    }

    override execute(): Observable<ResponseType> {
        return this.httpClient.delete<ResponseType>(this.url, {
            headers: this.httpOptions.headers, 
            body: this.body
        }).pipe(catchError(this.handleError));
    }

}