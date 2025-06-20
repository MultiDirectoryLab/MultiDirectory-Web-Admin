import { Injectable } from '@angular/core';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { CreateEntryResponse } from '@models/api/entry/create-response';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { DeleteEntryResponse } from '@models/api/entry/delete-response';
import { SearchRequest } from '@models/api/entry/search-request';
import { SearchResponse } from '@models/api/entry/search-response';
import { UpdateEntryRequest } from '@models/api/entry/update-request';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { AddPrincipalRequest } from '@models/api/kerberos/add-principal-request';
import { KerberosStatuses } from '@models/api/kerberos/kerberos-status';
import { GetAcpPageResponse } from '@models/api/login/get-acp-response';
import { LoginResponse } from '@models/api/login/login-response';
import { ModifyDnRequest } from '@models/api/modify-dn/modify-dn';
import { GetMultifactorResponse } from '@models/api/multifactor/get-multifactor-response';
import { SwapPolicyResponse } from '@models/api/policy/policy-swap-response';
import { UserSession } from '@models/api/sessions/user-session';
import { KerberosSetupRequest } from '@models/api/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/api/setup/kerberos-tree-setup-request';
import { SetupRequest } from '@models/api/setup/setup-request';
import { ChangePasswordRequest } from '@models/api/user/change-password-request';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { MockedSchema, MockedTree } from '@testing/scheme/mocked-schema';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MultidirectoryApiServiceStub extends MultidirectoryApiService {
  override login(login: string, password: string): Observable<LoginResponse> {
    return of({ token: 'mock-token' } as unknown as LoginResponse);
  }

  override logout(): Observable<void> {
    return of(undefined);
  }

  override whoami(): Observable<WhoamiResponse> {
    return of(
      new WhoamiResponse({
        display_name: 'mock-display-name',
        dn: 'mock-dn',
        mail: 'mock-email@example.com',
        user_principal_name: '123',
        sam_accout_name: '123',
      }),
    );
  }

  override search(request: SearchRequest): Observable<SearchResponse> {
    if (request.base_object.includes('CN=Schema')) {
      return of(MockedSchema);
    }
    if (request.scope == 0 && !request.base_object) {
      const result = Object.assign({}, MockedTree);
      result.search_result = [result.search_result[0]];
      return of(result);
    }
    if (request.scope == 1) {
      const result = Object.assign({}, MockedTree);
      const foundEntries = result.search_result.filter(
        (x) =>
          x.object_name.endsWith(request.base_object) &&
          x.object_name.length > request.base_object.length,
      );
      result.search_result = foundEntries;
      return of(result);
    }
    return of(MockedTree);
  }

  override checkSetup(): Observable<boolean> {
    return of(true);
  }

  override setup(request: SetupRequest): Observable<boolean> {
    return of(true);
  }

  override kerberosTreeSetup(request: KerberosTreeSetupRequest): Observable<boolean> {
    return of(true);
  }

  override kerberosSetup(request: KerberosSetupRequest): Observable<boolean> {
    return of(true);
  }

  override ktadd(request: string[]): Observable<any> {
    return of({});
  }

  override create(request: CreateEntryRequest): Observable<CreateEntryResponse> {
    return of({ id: 'mock-id' } as unknown as CreateEntryResponse);
  }

  override update(request: UpdateEntryRequest): Observable<UpdateEntryResponse> {
    return of({ success: true } as unknown as UpdateEntryResponse);
  }

  override delete(request: DeleteEntryRequest): Observable<DeleteEntryResponse> {
    return of({ success: true } as unknown as DeleteEntryResponse);
  }

  override getAccessPolicy(): Observable<AccessPolicy[]> {
    return of([]);
  }

  override saveAccessPolicy(client: AccessPolicy): Observable<boolean> {
    return of(true);
  }

  override deleteAccessPolicy(policyId: number): Observable<boolean> {
    return of(true);
  }

  override editAccessPolicy(policy: AccessPolicy): Observable<boolean> {
    return of(true);
  }

  override switchAccessPolicy(policyId: number): Observable<boolean> {
    return of(true);
  }

  override swapAccessPolicies(
    previousPolicyId: number,
    currentPolicyId: number,
  ): Observable<SwapPolicyResponse> {
    return of({ success: true } as unknown as SwapPolicyResponse);
  }

  override setupMultifactor(
    apiKey: string,
    apiSecret: string,
    isLdapScope: boolean,
  ): Observable<boolean> {
    return of(true);
  }

  override getMultifactor(): Observable<GetMultifactorResponse> {
    return of({ enabled: true } as unknown as GetMultifactorResponse);
  }

  override clearMultifactor(scope: 'ldap' | 'http'): Observable<void> {
    return of(undefined);
  }

  override changePassword(request: ChangePasswordRequest): Observable<boolean> {
    return of(true);
  }

  override getPasswordPolicy(): Observable<PasswordPolicy> {
    return of(new PasswordPolicy({ id: 1, name: 'mock-policy' }));
  }

  override savePasswordPolicy(client: PasswordPolicy): Observable<boolean> {
    return of(true);
  }

  override deletePasswordPolicy(): Observable<boolean> {
    return of(true);
  }

  override getMultifactorACP(login: string, password: string): Observable<GetAcpPageResponse> {
    return of({ page: 'mock-page' } as unknown as GetAcpPageResponse);
  }

  override updateDn(payload: ModifyDnRequest): Observable<any> {
    return of({});
  }

  override getKerberosStatus(): Observable<KerberosStatuses> {
    return of({ status: 'mock-status' } as unknown as KerberosStatuses);
  }

  override addPrincipal(request: AddPrincipalRequest): Observable<string> {
    return of('mock-principal');
  }

  override getSessions(upn: string): Observable<UserSession[]> {
    return of([]);
  }

  override deleteSession(sessionId: string): Observable<string> {
    return of('mock-session-id');
  }

  override deleteUserSessions(upn: string): Observable<string> {
    return of('mock-upn');
  }
}
