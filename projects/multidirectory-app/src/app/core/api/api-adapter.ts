import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AdapterSettings } from "./adapter-settings";

export class ApiAdapter<Settings extends AdapterSettings> {
    private _httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    constructor(private httpClient: HttpClient, private _settings: Settings) {}

    post<T>(resource: string, body: any): Observable<T> {
        const url = this._settings.baseUrl + '/' + resource;
        return this.httpClient.post<T>(url, body, this._httpOptions);
    }
}