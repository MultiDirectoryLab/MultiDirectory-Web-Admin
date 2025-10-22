import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';

export class SetupRequest {
  domain = '';
  username = '';
  user_principal_name = '';
  display_name = '';
  mail = '';
  password = '';
  repeatPassword = '';

  setupKdc = true;
  setupDhcp = true;
  generateKdcPasswords = true;
  krbadmin_password = '';
  krbadmin_password_repeat = '';

  stash_password = '';
  stash_password_repeat = '';

  setupDns = true;
  setupDnsRequest = new DnsSetupRequest({});
  setupDhcpRequest = new DhcpSetupRequest({});
}
