import { HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { LoginResponse } from "../models/login/login-response";
import { ApiAdapter } from "../core/api/api-adapter";
import { MultidirectoryAdapterSettings } from "../core/api/adapter-settings";
import { Observable, Subject } from "rxjs";
import { WhoamiResponse } from "../models/whoami/whoami-response";

@Injectable({
    providedIn: 'root'
})
export class MultidirectoryApiService {
    constructor(@Inject('apiAdapter') private httpClient: ApiAdapter<MultidirectoryAdapterSettings>) {}

    login(login: string, password: string): Observable<LoginResponse> {
        const payload = new HttpParams()
                .set('username', login)
                .set('password', password);

        return this.httpClient.post<LoginResponse>('auth/token/get', payload);
    }

    whoami(): Observable<WhoamiResponse> {
        return this.httpClient.get<WhoamiResponse>('auth/users/me');
    }
}