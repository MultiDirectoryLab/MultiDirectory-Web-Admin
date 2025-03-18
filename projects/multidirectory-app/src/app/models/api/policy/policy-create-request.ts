import { AccessPolicy } from '@core/access-policy/access-policy';
import { IpOption } from '@core/access-policy/access-policy-ip-address';

export class PolicyCreateRequest {
  id?: number;
  name = '';
  netmasks: IpOption[] = [];
  raw?: string;
  groups: string[] = [];
  priority?: number;
  mfa_status: number;
  mfa_groups: string[] = [];
  bypass_no_connection = false;
  bypass_service_failure = false;
  is_http = false;
  is_ldap = false;
  is_kerberos = false;

  constructor(policy: AccessPolicy) {
    this.id = policy.id;
    this.name = policy.name;
    this.netmasks = policy.ipRange;
    this.groups = policy.groups;
    this.priority = policy.priority;
    this.mfa_status = policy.mfaStatus ?? 0;
    this.mfa_groups = policy.mfaGroups;

    this.bypass_no_connection = policy.bypassNoConnection;
    this.bypass_service_failure = policy.bypassServiceFailure;
    this.is_http = policy.isHttp;
    this.is_kerberos = policy.isKerberos;
    this.is_ldap = policy.isLdap;
  }
}
