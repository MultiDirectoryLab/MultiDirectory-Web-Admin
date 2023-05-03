import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AdapterSettings } from "./adapter-settings";

export class ApiAdapter<Settings extends AdapterSettings> {
    private _httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                  
    };

    constructor(private httpClient: HttpClient, private _settings: Settings) {}

    post<T>(resource: string, body: any = null): Observable<T> {
        const url = this._settings.baseUrl + '/' + resource;
        this.ensureBearer();
        return this.httpClient.post<T>(url, body, this._httpOptions);
    }

    get<T>(resource: string): Observable<T> {
        const url = this._settings.baseUrl + '/' + resource;
        this.ensureBearer();
        return this.httpClient.get<T>(url, this._httpOptions);
    }

    private ensureBearer() {
        const token = localStorage.getItem('access_token');
        if(token) {
            this._httpOptions.headers = this._httpOptions.headers.set('Authorization', `Bearer ${token}`);
        }
    }
}