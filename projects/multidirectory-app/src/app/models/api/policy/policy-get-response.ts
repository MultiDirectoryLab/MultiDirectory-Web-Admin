import { IpRange } from '@core/access-policy/access-policy-ip-address';

export class PolicyResponse {
  enabled: boolean = false;
  id: number = 0;
  name: string = '';
  netmasks: string[] = [];
  raw: (IpRange | string)[] = [];
  groups: string[] = [];
  priority = 0;
  mfa_status = 0;
  mfa_groups: string[] = [];
  bypass_no_connection = false;
  bypass_service_failure = false;
  is_http = false;
  is_kerberos = false;
  is_ldap = false;
}
