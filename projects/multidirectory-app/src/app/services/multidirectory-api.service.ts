import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { Observable, map } from 'rxjs';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { PasswordPolicyGetResponse } from '@models/api/password-policy/password-policy-get-response';
import { PasswordPolicyPutRequest } from '@models/api/password-policy/password-policy-put-request';
import { GetAcpPageResponse } from '@models/api/login/get-acp-response';
import { ModifyDnRequest } from '@models/api/modify-dn/modify-dn';
import { KerberosSetupRequest } from '@models/api/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/api/setup/kerberos-tree-setup-request';
import { KerberosStatuses } from '@models/api/kerberos/kerberos-status';
import { AddPrincipalRequest } from '@models/api/kerberos/add-principal-request';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { GetSessionsResponse } from '@models/api/sessions/get-session-response';
import { UserSession } from '@models/api/sessions/user-session';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { CreateEntryResponse } from '@models/api/entry/create-response';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { DeleteEntryResponse } from '@models/api/entry/delete-response';
import { SearchRequest } from '@models/api/entry/search-request';
import { SearchResponse } from '@models/api/entry/search-response';
import { UpdateEntryRequest } from '@models/api/entry/update-request';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { LoginResponse } from '@models/api/login/login-response';
import { GetMultifactorResponse } from '@models/api/multifactor/get-multifactor-response';
import { SetupMultifactorRequest } from '@models/api/multifactor/setup-multifactor-request';
import { PolicyCreateRequest } from '@models/api/policy/policy-create-request';
import { PolicyResponse } from '@models/api/policy/policy-get-response';
import { PolicyPutRequest } from '@models/api/policy/policy-put-request';
import { SwapPolicyRequest } from '@models/api/policy/policy-swap-request';
import { SwapPolicyResponse } from '@models/api/policy/policy-swap-response';
import { SetupRequest } from '@models/api/setup/setup-request';
import { ChangePasswordRequest } from '@models/api/user/change-password-request';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaEntitiesResponse } from '@models/api/schema/entities/schema-entities-response';
import { SchemaObjectClassResponse } from '@models/api/schema/object-classes/schema-object-classes-response';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaAttributeTypesResponse } from '@models/api/schema/attribute-types/schema-attribute-type-response';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { q } from 'node_modules/@angular/cdk/overlay-module.d-C2CxnwqT';
import { SyslogEvent } from '@models/api/syslog/syslog-event';

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

  getSchemaEntity(name: string): Observable<SchemaEntity> {
    let url = `schema/entity_type/${name}`;
    return this.httpClient.get<SchemaEntity>(url).execute();
  }

  getSchemaEntities(
    pageNumber: number,
    pageSize: number,
    query: string,
  ): Observable<SchemaEntitiesResponse> {
    let url = `schema/entity_types?page_number=${pageNumber}&page_size=${pageSize}`;
    if (!!query) {
      url = url + `&query=${query}`;
    }
    return this.httpClient.get<SchemaEntitiesResponse>(url).execute();
  }

  getSchemaObjectClasses(
    pageNumber: number,
    pageSize: number,
    query: string,
  ): Observable<SchemaObjectClassResponse> {
    let url = `schema/object_classes?page_number=${pageNumber}&page_size=${pageSize}`;
    if (!!query) {
      url = url + `&query=${query}`;
    }
    return this.httpClient.get<SchemaObjectClassResponse>(url).execute();
  }

  getSchemaAttributes(
    pageNumber: number,
    pageSize: number,
    query: string,
  ): Observable<SchemaAttributeTypesResponse> {
    let url = `schema/attribute_types?page_number=${pageNumber}&page_size=${pageSize}`;
    if (!!query) {
      url = url + `&query=${query}`;
    }
    return this.httpClient.get<SchemaAttributeTypesResponse>(url).execute();
  }

  createSchemaAttribute(attibute: SchemaAttributeType): Observable<string> {
    return this.httpClient.post<string>('schema/attribute_type', attibute).execute();
  }

  updateSchemaAttribute(attibute: SchemaAttributeType): Observable<string> {
    return this.httpClient
      .patch<string>(`schema/attribute_type/${attibute.name}`, attibute)
      .execute();
  }

  getSchemaAttribute(attributeName: string): Observable<SchemaAttributeType> {
    return this.httpClient
      .get<SchemaAttributeType>(`schema/attribute_type/${attributeName}`)
      .execute();
  }

  deleteSchemaAttributes(attributeNames: string[]): Observable<string> {
    return this.httpClient
      .post<string>(`schema/attribute_types/delete`, { attribute_types_names: attributeNames })
      .execute();
  }

  updateSchemaEntity(entity: SchemaEntity) {
    return this.httpClient.patch<string>(`schema/entity_type/${entity.name}`, entity).execute();
  }

  createObjectClass(objectClass: SchemaObjectClass): Observable<string> {
    return this.httpClient.post<string>(`schema/object_class`, objectClass).execute();
  }

  updateObjectClass(objectClass: SchemaObjectClass): Observable<string> {
    return this.httpClient
      .patch<string>(`schema/object_class/${objectClass.name}`, objectClass)
      .execute();
  }

  getSchemaObjectClass(objectClassName: string): Observable<SchemaObjectClass> {
    return this.httpClient
      .get<SchemaObjectClass>(`schema/object_class/${objectClassName}`)
      .execute();
  }

  deleteSchemaObjectClass(objectClassNames: string[]): Observable<string> {
    return this.httpClient
      .post<string>('schema/object_class/delete', { object_classes_names: objectClassNames })
      .execute();
  }

  getAuditPolicies(): Observable<SyslogEvent[]> {
    return this.httpClient.get<SyslogEvent[]>('audit/policies').execute();
  }
}
