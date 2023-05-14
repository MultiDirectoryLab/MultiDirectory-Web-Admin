import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AdapterSettings } from "./adapter-settings";

export class ApiAdapter<Settings extends AdapterSettings> {

    constructor(private httpClient: HttpClient, private _settings: Settings) {}

    post<T>(resource: string, body: any = null, ): PostRequest<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return new PostRequest<T>(url, body, this.httpClient);
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
        return this.httpClient.post<ResponseType>(this.url, this.body, this.httpOptions);
    }

}


export class GetRequest<ResponseType> extends HttpRequest<ResponseType> {
    constructor(url: string, httpClient: HttpClient) {
        super(url, httpClient);
    } 

    override execute(): Observable<ResponseType> {
        return this.httpClient.get<ResponseType>(this.url, this.httpOptions);
    }
}