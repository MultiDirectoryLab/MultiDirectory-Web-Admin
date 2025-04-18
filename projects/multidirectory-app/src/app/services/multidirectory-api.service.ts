import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginResponse } from '@models/login/login-response';
import { ApiAdapter } from '@core/api/api-adapter';
import { Observable, map } from 'rxjs';
import { WhoamiResponse } from '@models/whoami/whoami-response';
import { SearchRequest } from '@models/entry/search-request';
import { SearchResponse } from '@models/entry/search-response';
import { SetupRequest } from '@models/setup/setup-request';
import { CreateEntryRequest } from '@models/entry/create-request';
import { CreateEntryResponse } from '@models/entry/create-response';
import { DeleteEntryRequest } from '@models/entry/delete-request';
import { DeleteEntryResponse } from '@models/entry/delete-response';
import { UpdateEntryResponse } from '@models/entry/update-response';
import { UpdateEntryRequest } from '@models/entry/update-request';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { PolicyCreateRequest } from '@models/policy/policy-create-request';
import { PolicyResponse } from '@models/policy/policy-get-response';
import { PolicyPutRequest } from '@models/policy/policy-put-request';
import { SwapPolicyRequest } from '@models/policy/policy-swap-request';
import { SwapPolicyResponse } from '@models/policy/policy-swap-response';
import { SetupMultifactorRequest } from '@models/multifactor/setup-multifactor-request';
import { GetMultifactorResponse } from '@models/multifactor/get-multifactor-response';
import { ChangePasswordRequest } from '@models/user/change-password-request';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordPolicyGetResponse } from '@models/password-policy/password-policy-get-response';
import { PasswordPolicyPutRequest } from '@models/password-policy/password-policy-put-request';
import { GetAcpPageResponse } from '@models/login/get-acp-response';
import { ModifyDnRequest } from '@models/modify-dn/modify-dn';
import { KerberosSetupRequest } from '@models/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/setup/kerberos-tree-setup-request';
import { KerberosStatuses } from '@models/kerberos/kerberos-status';
import { AddPrincipalRequest } from '@models/kerberos/add-principal-request';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { GetSessionsResponse } from '@models/sessions/get-session-response';
import { UserSession } from '@models/sessions/user-session';

@Injectable({
  providedIn: 'root',
})
export class MultidirectoryApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);

  login(login: string, password: string): Observable<LoginResponse> {
    const payload = new HttpParams().set('username', login).set('password', password);

    return this.httpClient.post<LoginResponse>('auth/', payload).useUrlEncodedForm().execute();
  }

  logout(): Observable<void> {
    return this.httpClient.delete<void>('auth/').execute();
  }

  whoami(): Observable<WhoamiResponse> {
    return this.httpClient.get<WhoamiResponse>('auth/me').execute();
  }

  search(request: SearchRequest): Observable<SearchResponse> {
    return this.httpClient.post<SearchResponse>('entry/search', request).execute();
  }

  checkSetup(): Observable<boolean> {
    return this.httpClient.get<boolean>('auth/setup').execute();
  }

  setup(request: SetupRequest): Observable<boolean> {
    return this.httpClient.post<boolean>('auth/setup', request).execute();
  }

  kerberosTreeSetup(request: KerberosTreeSetupRequest): Observable<boolean> {
    return this.httpClient.post<boolean>('kerberos/setup/tree', request).execute();
  }

  kerberosSetup(request: KerberosSetupRequest): Observable<boolean> {
    return this.httpClient.post<boolean>('kerberos/setup', request).execute();
  }

  ktadd(request: string[]): Observable<any> {
    return this.httpClient.postFile('kerberos/ktadd', request);
  }

  create(request: CreateEntryRequest): Observable<CreateEntryResponse> {
    return this.httpClient.post<CreateEntryResponse>('entry/add', request).execute();
  }

  update(request: UpdateEntryRequest): Observable<UpdateEntryResponse> {
    return this.httpClient.patch<UpdateEntryResponse>('entry/update', request).execute();
  }
  delete(request: DeleteEntryRequest): Observable<DeleteEntryResponse> {
    return this.httpClient.delete<DeleteEntryResponse>('entry/delete', request).execute();
  }

  getAccessPolicy(): Observable<AccessPolicy[]> {
    return this.httpClient
      .get<PolicyResponse[]>('policy')
      .execute()
      .pipe(
        map((response) =>
          response.map((policy) => {
            const accessPolicy = new AccessPolicy({
              id: policy.id,
              name: policy.name,
              enabled: policy.enabled,
              groups: policy.groups,
              ipRange: policy.raw.map((x) => {
                if (typeof x == 'string' && x.includes('IPv4Address')) {
                  const matchRegex = new RegExp(/(?:IPv4Address\(\'([^']*)'\))/gi);
                  const result = Array.from(x.matchAll(matchRegex));
                  if (!result || result?.length < 2) {
                    return x;
                  }
                  return result[0][1] + '-' + result[1][1];
                }
                return x;
              }),
              priority: policy.priority,
              mfaStatus: policy.mfa_status,
              mfaGroups: policy.mfa_groups,
              bypassNoConnection: policy.bypass_no_connection,
              bypassServiceFailure: policy.bypass_service_failure,
              isHttp: policy.is_http,
              isKerberos: policy.is_kerberos,
              isLdap: policy.is_ldap,
            });
            accessPolicy.id = policy.id;
            return accessPolicy;
          }),
        ),
      );
  }

  saveAccessPolicy(client: AccessPolicy): Observable<boolean> {
    return this.httpClient.post<boolean>('policy', new PolicyCreateRequest(client)).execute();
  }

  deleteAccessPolicy(policyId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`policy/${policyId}`).execute();
  }

  editAccessPolicy(policy: AccessPolicy): Observable<boolean> {
    const editPolicyRequest = new PolicyPutRequest(policy);
    return this.httpClient.put<boolean>('policy', editPolicyRequest).execute();
  }

  switchAccessPolicy(policyId: number): Observable<boolean> {
    return this.httpClient.patch<boolean>(`policy/${policyId}`).execute();
  }

  swapAccessPolicies(previousPolicyId: number, currentPolicyId: number) {
    const request = new SwapPolicyRequest({
      first_policy_id: previousPolicyId,
      second_policy_id: currentPolicyId,
    });
    return this.httpClient.post<SwapPolicyResponse>('policy/swap', request).execute();
  }

  setupMultifactor(apiKey: string, apiSecret: string, isLdapScope: boolean) {
    const request = new SetupMultifactorRequest({
      mfa_key: apiKey,
      mfa_secret: apiSecret,
      is_ldap_scope: isLdapScope,
    });
    return this.httpClient.post<boolean>('multifactor/setup', request).execute();
  }

  getMultifactor(): Observable<GetMultifactorResponse> {
    return this.httpClient.post<GetMultifactorResponse>('multifactor/get').execute();
  }

  clearMultifactor(scope: 'ldap' | 'http') {
    return this.httpClient.delete<void>(`multifactor/keys?scope=${scope}`).execute();
  }

  changePassword(request: ChangePasswordRequest): Observable<boolean> {
    return this.httpClient.patch<boolean>('auth/user/password', request).execute();
  }

  getPasswordPolicy(): Observable<PasswordPolicy> {
    return this.httpClient
      .get<PasswordPolicyGetResponse>('password-policy')
      .execute()
      .pipe(
        map((policy) => {
          const passwordPolicy = new PasswordPolicy({
            id: 1,
            name: policy.name,
            enforcePasswordHistory: policy.password_history_length,
            minimumPasswordAge: policy.minimum_password_age_days,
            maximumPasswordAge: policy.maximum_password_age_days,
            minimumPasswordLength: policy.minimum_password_length,
            passwordMustMeetComplexityRequirements:
              policy.password_must_meet_complexity_requirements,
          });
          return passwordPolicy;
        }),
      );
  }

  savePasswordPolicy(client: PasswordPolicy): Observable<boolean> {
    return this.httpClient
      .put<boolean>('password-policy', new PasswordPolicyPutRequest(client))
      .execute();
  }

  deletePasswordPolicy(): Observable<boolean> {
    return this.httpClient.delete<boolean>('password-policy').execute();
  }

  getMultifactorACP(login: string, password: string): Observable<GetAcpPageResponse> {
    const payload = new HttpParams().set('username', login).set('password', password);
    return this.httpClient
      .post<GetAcpPageResponse>('multifactor/connect', payload)
      .useUrlEncodedForm()
      .execute();
  }

  updateDn(payload: ModifyDnRequest): any {
    return this.httpClient.put<ModifyDnRequest>('entry/update/dn', payload).execute();
  }

  getKerberosStatus(): Observable<KerberosStatuses> {
    return this.httpClient
      .get<KerberosStatuses>('kerberos/status')
      .execute()
      .pipe(
        map((x) => {
          return Number(x);
        }),
      );
  }

  addPrincipal(request: AddPrincipalRequest): Observable<string> {
    return this.httpClient.post<string>('kerberos/principal/add', request).execute();
  }

  formatDateTime(dateTimeStr: string) {
    const date = new Date(dateTimeStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }

  getSessions(upn: string): Observable<UserSession[]> {
    return this.httpClient
      .get<GetSessionsResponse>('sessions/' + upn)
      .execute()
      .pipe(
        map((dict) => {
          return Object.keys(dict).map((x) => {
            const session = new UserSession(dict[x]);
            session.session_id = x;
            session.issued = this.formatDateTime(session.issued);
            return session;
          });
        }),
      );
  }

  deleteSession(sessionId: string): Observable<string> {
    return this.httpClient.delete<string>('sessions/session/' + sessionId).execute();
  }

  deleteUserSessions(upn: string): Observable<string> {
    return this.httpClient.delete<string>('sessions/' + upn).execute();
  }
}
