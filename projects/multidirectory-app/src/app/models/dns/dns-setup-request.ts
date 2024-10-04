export class DnsSetupRequest {
  zone_name: string = 'beta.multidirectory.io';
  domain: string = 'beta.multidirectory.io.';
  dns_ip_address: string = '5.35.9.32';
  default_ttl: string = '8600';
  tsig_key: string = '';

  constructor(obj: Partial<DnsSetupRequest>) {
    Object.assign(this, obj);
  }
}
