import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';

export class SetupRequest {
  domain: string = '';
  username: string = '';
  user_principal_name: string = '';
  display_name: string = '';
  mail: string = '';
  password: string = '';
  repeatPassword: string = '';

  setupKdc = true;
  setupDhcp = true;
  generateKdcPasswords = true;
  krbadmin_password: string = '';
  krbadmin_password_repeat: string = '';

  stash_password: string = '';
  stash_password_repeat: string = '';

  setupDns = true;
  setupDnsRequest = new DnsSetupRequest({});
  setupDhcpRequest = new DhcpSetupRequest({});
}
