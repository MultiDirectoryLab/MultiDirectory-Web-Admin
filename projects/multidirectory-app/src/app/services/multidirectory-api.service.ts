import { HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { LoginResponse } from "../models/login/login-response";
import { ApiAdapter } from "../core/api/api-adapter";
import { MultidirectoryAdapterSettings } from "../core/api/adapter-settings";
import { Observable, of } from "rxjs";
import { WhoamiResponse } from "../models/whoami/whoami-response";
import { SearchRequest } from "../models/entry/search-request";
import { SearchResponse } from "../models/entry/search-response";
import { SetupRequest } from "../models/setup/setup-request";

@Injectable({
    providedIn: 'root'
})
export class MultidirectoryApiService {
    constructor(@Inject('apiAdapter') private httpClient: ApiAdapter<MultidirectoryAdapterSettings>) {}

    login(login: string, password: string): Observable<LoginResponse> {
        const payload = new HttpParams()
                .set('username', login)
                .set('password', password);

        return this.httpClient.post<LoginResponse>('auth/token/get', payload)
                .useUrlEncodedForm()
                .execute();
    }

    refresh(): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>('auth/token/refresh')
                .refreshToken()
                .execute();
    }

    whoami(): Observable<WhoamiResponse> {
        return this.httpClient.get<WhoamiResponse>('auth/me')
                .ensureBearer()
                .execute();
    }

    search(request: SearchRequest): Observable<SearchResponse> {
        return this.httpClient.post<SearchResponse>('entry/search', request)
                .ensureBearer()
                .execute();
    }

    private tempSetup = false;
    checkSetup(): Observable<boolean> {
        return of(this.tempSetup); //this.httpClient.get<boolean>('entry/setup').execute();
    }

    setup(request: SetupRequest): Observable<boolean> {
        this.tempSetup = true;
        return of(true);
    }
}