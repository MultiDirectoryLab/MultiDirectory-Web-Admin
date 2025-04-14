import { DnsSetupRequest } from '@models/dns/dns-setup-request';

export class SetupRequest {
  domain = '';
  username = '';
  user_principal_name = '';
  display_name = '';
  mail = '';
  password = '';
  repeatPassword = '';

  setupKdc = true;
  generateKdcPasswords = true;
  krbadmin_password = '';
  krbadmin_password_repeat = '';

  stash_password = '';
  stash_password_repeat = '';

  setupDns = true;
  setupDnsRequest = new DnsSetupRequest({});
}
