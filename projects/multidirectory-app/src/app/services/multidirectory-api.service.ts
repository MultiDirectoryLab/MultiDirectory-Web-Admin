import { HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { LoginResponse } from "../models/login/login-response";
import { ApiAdapter } from "../core/api/api-adapter";
import { MultidirectoryAdapterSettings } from "../core/api/adapter-settings";
import { Observable, map, of } from "rxjs";
import { WhoamiResponse } from "../models/whoami/whoami-response";
import { SearchRequest } from "../models/entry/search-request";
import { SearchResponse } from "../models/entry/search-response";
import { SetupRequest } from "../models/setup/setup-request";
import { CreateEntryRequest } from "../models/entry/create-request";
import { CreateEntryResponse } from "../models/entry/create-response";
import { DeleteEntryRequest } from "../models/entry/delete-request";
import { DeleteEntryResponse } from "../models/entry/delete-response";
import { UpdateEntryResponse } from "../models/entry/update-response";
import { UpdateEntryRequest } from "../models/entry/update-request";
import { AccessPolicy } from "../core/access-policy/access-policy";
import { PolicyCreateRequest } from "../models/policy/policy-create-request";
import { PolicyResponse } from "../models/policy/policy-get-response";
import { PolicyDeleteRequest } from "../models/policy/policy-delete-request";
import { PolicyPutRequest } from "../models/policy/policy-put-request";
import { SwapPolicyRequest } from "../models/policy/policy-swap-request";
import { SwapPolicyResponse } from "../models/policy/policy-swap-response";
import { SetupMultifactorRequest } from "../models/multifactor/setup-multifactor-request";
import { GetMultifactorResponse } from "../models/multifactor/get-multifactor-response";
import { ChangePasswordRequest } from "../models/user/change-password-request";

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
                .execute();
    }

    whoami(): Observable<WhoamiResponse> {
        return this.httpClient.get<WhoamiResponse>('auth/me')
                .execute();
    }

    search(request: SearchRequest): Observable<SearchResponse> {
        return this.httpClient.post<SearchResponse>('entry/search', request)
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
            .execute();
    }

    update(request: UpdateEntryRequest): Observable<UpdateEntryResponse> {
        return this.httpClient.patch<UpdateEntryResponse>('entry/update', request)
            .execute();
    }
    delete(request: DeleteEntryRequest): Observable<DeleteEntryResponse> {
        return this.httpClient.delete<DeleteEntryResponse>('entry/delete', request)
            .execute();
    }

    getPolicy(): Observable<AccessPolicy[]> {
        return this.httpClient.get<PolicyResponse[]>('policy')
            .execute()
            .pipe(map(response => response.map(policy => {
                const accessPolicy = new AccessPolicy({
                    id: policy.id,
                    name: policy.name,
                    enabled: policy.enabled,
                    groups: policy.groups,
                    ipRange: policy.netmasks,
                    priority: policy.priority,
                    mfaStatus: policy.mfa_status,
                    mfaGroups: policy.mfa_groups
                });
                accessPolicy.id = policy.id;
                return accessPolicy;
            })));
    }

    savePolicy(client: AccessPolicy): Observable<boolean> {
        return this.httpClient.post<boolean>('policy', new PolicyCreateRequest(client)).execute();
    }

    deletePolicy(policyId: number): Observable<boolean> {
        return this.httpClient.delete<boolean>(`policy/${policyId}`).execute();
    }

    editPolicy(policy: AccessPolicy): Observable<boolean> {
        const editPolicyRequest = new PolicyPutRequest(policy)
        return this.httpClient.put<boolean>(`policy`, editPolicyRequest).execute();
    }

    switchPolicy(policyId: number): Observable<boolean> {
        return this.httpClient.patch<boolean>(`policy/${policyId}`).execute();
    }

    swapPolicies(previousPolicyId: number, currentPolicyId: number) {
        const request = new SwapPolicyRequest({
            first_policy_id: previousPolicyId,
            second_policy_id: currentPolicyId
        });
        return this.httpClient.post<SwapPolicyResponse>(`policy/swap`, request).execute();
    }

    setupMultifactor(apiKey: string, apiSecret: string, isLdapScope: boolean) {
        const request = new SetupMultifactorRequest({
            mfa_key: apiKey,
            mfa_secret: apiSecret,
            is_ldap_scope: isLdapScope
        });
        return this.httpClient.post<boolean>('multifactor/setup', request).execute();
    }

    getMultifactor(): Observable<GetMultifactorResponse> {
        return this.httpClient.post<GetMultifactorResponse>('multifactor/get').execute();
    }
    changePassword(request: ChangePasswordRequest): Observable<boolean> {
        return this.httpClient.patch<boolean>('auth/user/password', request).execute();
    }
}