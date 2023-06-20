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
import { CreateEntryRequest } from "../models/entry/create-request";
import { CreateEntryResponse } from "../models/entry/create-response";
import { DeleteEntryRequest } from "../models/entry/delete-request";
import { DeleteEntryResponse } from "../models/entry/delete-response";

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

    checkSetup(): Observable<boolean> {
        return this.httpClient.get<boolean>('auth/setup').execute();
    }

    setup(request: SetupRequest): Observable<boolean> {
        return this.httpClient.post<boolean>('auth/setup', request).execute();
    }

    create(request: CreateEntryRequest): Observable<CreateEntryResponse> {
        return this.httpClient.post<CreateEntryResponse>('entry/add', request)
            .ensureBearer()
            .execute();
    }


    delete(request: DeleteEntryRequest): Observable<DeleteEntryResponse> {
        return this.httpClient.delete<DeleteEntryResponse>('entry/delete', request)
            .ensureBearer()
            .execute();
    }
}