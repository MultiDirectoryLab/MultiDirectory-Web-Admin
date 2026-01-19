import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { Constants } from '@core/constants';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { CreateEntryRequest } from '@models/api/entry/create-request';
import { CreateEntryResponse } from '@models/api/entry/create-response';
import { DeleteManyEntryRequest } from '@models/api/entry/delete-many-request';
import { DeleteEntryRequest } from '@models/api/entry/delete-request';
import { DeleteEntryResponse } from '@models/api/entry/delete-response';
import { SearchRequest } from '@models/api/entry/search-request';
import { SearchResponse } from '@models/api/entry/search-response';
import { UpdateManyEntryRequest } from '@models/api/entry/update-many-request';
import { UpdateEntryRequest } from '@models/api/entry/update-request';
import { UpdateEntryResponse } from '@models/api/entry/update-response';
import { AddPrincipalRequest } from '@models/api/kerberos/add-principal-request';
import { KerberosStatuses } from '@models/api/kerberos/kerberos-status';
import { GetAcpPageResponse } from '@models/api/login/get-acp-response';
import { LoginResponse } from '@models/api/login/login-response';
import { ModifyDnRequest } from '@models/api/modify-dn/modify-dn';
import { GetMultifactorResponse } from '@models/api/multifactor/get-multifactor-response';
import { SetupMultifactorRequest } from '@models/api/multifactor/setup-multifactor-request';
import { PasswordPolicyGetResponse } from '@models/api/password-policy/password-policy-get-response';
import { PasswordPolicyPutRequest } from '@models/api/password-policy/password-policy-put-request';
import { PolicyCreateRequest } from '@models/api/policy/policy-create-request';
import { PolicyResponse } from '@models/api/policy/policy-get-response';
import { PolicyPutRequest } from '@models/api/policy/policy-put-request';
import { SwapPolicyRequest } from '@models/api/policy/policy-swap-request';
import { SwapPolicyResponse } from '@models/api/policy/policy-swap-response';
import { SchemaAttributeType } from '@models/api/schema/attribute-types/schema-attibute-type';
import { SchemaAttributeTypesResponse } from '@models/api/schema/attribute-types/schema-attribute-type-response';
import { SchemaEntitiesResponse } from '@models/api/schema/entities/schema-entities-response';
import { SchemaEntity } from '@models/api/schema/entities/schema-entity';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { SchemaObjectClassResponse } from '@models/api/schema/object-classes/schema-object-classes-response';
import { GetSessionsResponse } from '@models/api/sessions/get-session-response';
import { UserSession } from '@models/api/sessions/user-session';
import { KerberosSetupRequest } from '@models/api/setup/kerberos-setup-request';
import { KerberosTreeSetupRequest } from '@models/api/setup/kerberos-tree-setup-request';
import { SetupRequest } from '@models/api/setup/setup-request';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { ChangePasswordRequest } from '@models/api/user/change-password-request';
import { WhoamiResponse } from '@models/api/whoami/whoami-response';
import { map, Observable } from 'rxjs';
import { SyslogConnection } from '../models/api/syslog/syslog-connection';
import { SetPrimaryGroupRequest } from '@models/api/entry/set-primary-group-request';

@Injectable({
  providedIn: 'root',
})
export class MultidirectoryApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);

  login(login: string, password: string): Observable<LoginResponse> {
    const form = new FormData();
    form.append('username', login);
    form.append('password', password);

    return this.httpClient.post<LoginResponse>('auth/', form).execute();
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

  resetPasswordHistory(username: string): Observable<void> {
    return this.httpClient.post<void>('user/password_history/clear', username).execute();
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
  updateMany(request: UpdateManyEntryRequest): Observable<UpdateEntryResponse> {
    return this.httpClient.patch<UpdateEntryResponse>('entry/update_many', request).execute();
  }
  delete(request: DeleteEntryRequest): Observable<DeleteEntryResponse> {
    return this.httpClient.delete<DeleteEntryResponse>('entry/delete', request).execute();
  }
  deleteMany(request: DeleteManyEntryRequest): Observable<DeleteEntryResponse> {
    return this.httpClient.post<DeleteEntryResponse>('entry/delete_many', request.selectedItems).execute();
  }

  setPrimaryGroup(request: SetPrimaryGroupRequest): Observable<SetPrimaryGroupRequest> {
    return this.httpClient.post<SetPrimaryGroupRequest>('entry/set_primary_group', request).execute();
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

  getPasswordPolicy(id: string): Observable<PasswordPolicy> {
    return this.httpClient
      .get<PasswordPolicyGetResponse>(`password-policy/${id}`)
      .execute()
      .pipe(
        map(
          (policy) =>
            new PasswordPolicy({
              id: policy.id,
              name: policy.name,
              language: policy.language,
              isExactMatch: policy.is_exact_match,
              historyLength: policy.history_length,
              minAgeDays: policy.min_age_days,
              maxAgeDays: policy.max_age_days,
              minLength: policy.min_length,
              maxLength: policy.max_length,
              minLowercaseLettersCount: policy.min_lowercase_letters_count,
              minUppercaseLettersCount: policy.min_uppercase_letters_count,
              minLettersCount: policy.min_letters_count,
              minSpecialSymbolsCount: policy.min_special_symbols_count,
              minDigitsCount: policy.min_digits_count,
              minUniqueSymbolsCount: policy.min_unique_symbols_count,
              maxRepeatingSymbolsInRowCount: policy.max_repeating_symbols_in_row_count,
              maxSequentialKeyboardSymbolsCount: policy.max_sequential_keyboard_symbols_count,
              maxSequentialAlphabetSymbolsCount: policy.max_sequential_alphabet_symbols_count,
              maxFailedAttempts: policy.max_failed_attempts,
              failedAttemptsResetSec: policy.failed_attempts_reset_sec,
              lockoutDurationSec: policy.lockout_duration_sec,
              failDelaySec: policy.fail_delay_sec,
              priority: policy.priority,
              scopes: policy.group_paths,
            }),
        ),
      );
  }

  getAllPasswordPolicies(): Observable<PasswordPolicy[]> {
    return this.httpClient
      .get<PasswordPolicyGetResponse[]>('password-policy/all')
      .execute()
      .pipe(
        map((policies) => {
          return policies.map(
            (policy) =>
              new PasswordPolicy({
                id: policy.id,
                name: policy.name,
                language: policy.language,
                isExactMatch: policy.is_exact_match,
                historyLength: policy.history_length,
                minAgeDays: policy.min_age_days,
                maxAgeDays: policy.max_age_days,
                minLength: policy.min_length,
                maxLength: policy.max_length,
                minLowercaseLettersCount: policy.min_lowercase_letters_count,
                minUppercaseLettersCount: policy.min_uppercase_letters_count,
                minLettersCount: policy.min_letters_count,
                minSpecialSymbolsCount: policy.min_special_symbols_count,
                minDigitsCount: policy.min_digits_count,
                minUniqueSymbolsCount: policy.min_unique_symbols_count,
                maxRepeatingSymbolsInRowCount: policy.max_repeating_symbols_in_row_count,
                maxSequentialKeyboardSymbolsCount: policy.max_sequential_keyboard_symbols_count,
                maxSequentialAlphabetSymbolsCount: policy.max_sequential_alphabet_symbols_count,
                maxFailedAttempts: policy.max_failed_attempts,
                failedAttemptsResetSec: policy.failed_attempts_reset_sec,
                lockoutDurationSec: policy.lockout_duration_sec,
                failDelaySec: policy.fail_delay_sec,
                priority: policy.priority,
                scopes: policy.group_paths,
              }),
          );
        }),
      );
  }

  getPasswordPolicyByDirPath(dirPath: string): Observable<PasswordPolicy> {
    return this.httpClient
      .get<PasswordPolicyGetResponse>(`password-policy/by_dir_path_dn/${dirPath}`)
      .execute()
      .pipe(
        map(
          (policy) =>
            new PasswordPolicy({
              id: policy.id,
              name: policy.name,
              language: policy.language,
              isExactMatch: policy.is_exact_match,
              historyLength: policy.history_length,
              minAgeDays: policy.min_age_days,
              maxAgeDays: policy.max_age_days,
              minLength: policy.min_length,
              maxLength: policy.max_length,
              minLowercaseLettersCount: policy.min_lowercase_letters_count,
              minUppercaseLettersCount: policy.min_uppercase_letters_count,
              minLettersCount: policy.min_letters_count,
              minSpecialSymbolsCount: policy.min_special_symbols_count,
              minDigitsCount: policy.min_digits_count,
              minUniqueSymbolsCount: policy.min_unique_symbols_count,
              maxRepeatingSymbolsInRowCount: policy.max_repeating_symbols_in_row_count,
              maxSequentialKeyboardSymbolsCount: policy.max_sequential_keyboard_symbols_count,
              maxSequentialAlphabetSymbolsCount: policy.max_sequential_alphabet_symbols_count,
              maxFailedAttempts: policy.max_failed_attempts,
              failedAttemptsResetSec: policy.failed_attempts_reset_sec,
              lockoutDurationSec: policy.lockout_duration_sec,
              failDelaySec: policy.fail_delay_sec,
              priority: policy.priority,
              scopes: policy.group_paths,
            }),
        ),
      );
  }

  getDefaultPasswordPolicy(): Observable<PasswordPolicy> {
    return this.getAllPasswordPolicies().pipe(
      map((policies) => policies.find((policy) => policy.name === Constants.DefaultPolicyName) ?? new PasswordPolicy()),
    );
  }

  savePasswordPolicy(policy: PasswordPolicy): Observable<boolean> {
    return this.httpClient.put<boolean>(`password-policy/${policy.id}`, new PasswordPolicyPutRequest(policy)).execute();
  }

  deletePasswordPolicy(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`password-policy/${id}`).execute();
  }

  uploadForbiddenPasswords(file: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post<boolean>('password_ban_word/upload_txt', formData).execute();
  }

  getMultifactorACP(login: string, password: string): Observable<GetAcpPageResponse> {
    const payload = new HttpParams().set('username', login).set('password', password);
    return this.httpClient.post<GetAcpPageResponse>('multifactor/connect', payload).useUrlEncodedForm().execute();
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

  getSchemaEntities(pageNumber: number, pageSize: number, query: string): Observable<SchemaEntitiesResponse> {
    let url = `schema/entity_types?page_number=${pageNumber}&page_size=${pageSize}`;
    if (!!query) {
      url = url + `&query=${query}`;
    }
    return this.httpClient.get<SchemaEntitiesResponse>(url).execute();
  }

  getSchemaObjectClasses(pageNumber: number, pageSize: number, query: string): Observable<SchemaObjectClassResponse> {
    let url = `schema/object_classes?page_number=${pageNumber}&page_size=${pageSize}`;
    if (!!query) {
      url = url + `&query=${query}`;
    }
    return this.httpClient.get<SchemaObjectClassResponse>(url).execute();
  }

  getSchemaAttributes(pageNumber: number, pageSize: number, query: string): Observable<SchemaAttributeTypesResponse> {
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
    return this.httpClient.patch<string>(`schema/attribute_type/${attibute.name}`, attibute).execute();
  }

  getSchemaAttribute(attributeName: string): Observable<SchemaAttributeType> {
    return this.httpClient.get<SchemaAttributeType>(`schema/attribute_type/${attributeName}`).execute();
  }

  deleteSchemaAttributes(attributeNames: string[]): Observable<string> {
    return this.httpClient.post<string>(`schema/attribute_types/delete`, { attribute_types_names: attributeNames }).execute();
  }

  updateSchemaEntity(entity: SchemaEntity) {
    return this.httpClient.patch<string>(`schema/entity_type/${entity.name}`, entity).execute();
  }

  createObjectClass(objectClass: SchemaObjectClass): Observable<string> {
    return this.httpClient.post<string>(`schema/object_class`, objectClass).execute();
  }

  updateObjectClass(objectClass: SchemaObjectClass): Observable<string> {
    return this.httpClient.patch<string>(`schema/object_class/${objectClass.name}`, objectClass).execute();
  }

  getSchemaObjectClass(objectClassName: string): Observable<SchemaObjectClass> {
    return this.httpClient.get<SchemaObjectClass>(`schema/object_class/${objectClassName}`).execute();
  }

  deleteSchemaObjectClass(objectClassNames: string[]): Observable<string> {
    return this.httpClient.post<string>('schema/object_class/delete', { object_classes_names: objectClassNames }).execute();
  }

  getAuditPolicies(): Observable<SyslogEvent[]> {
    return this.httpClient.get<SyslogEvent[]>('audit/policies').execute();
  }
  updateAuditEvent(id: string, event: SyslogEvent) {
    return this.httpClient.put<SyslogEvent[]>(`audit/policy/${id}`, event).execute();
  }
  getAuditDestinations(): Observable<SyslogConnection[]> {
    return this.httpClient.get<SyslogConnection[]>('audit/destinations').execute();
  }
  createAuditDestination(data: SyslogConnection): Observable<string> {
    return this.httpClient.post<string>('audit/destination', data).execute();
  }
  updateAuditDestination(data: SyslogConnection): Observable<string> {
    return this.httpClient.put<string>(`audit/destination/${data.id}`, data).execute();
  }
  deleteAuditDestination(connectionId: number): Observable<string> {
    return this.httpClient.delete<string>(`audit/destination/${connectionId}`).execute();
  }
}
