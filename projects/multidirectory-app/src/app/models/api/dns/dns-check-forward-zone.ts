export class DnsCheckForwardZoneRequest {
  dns_server_ips: string[] = [];

  constructor(obj: Partial<DnsCheckForwardZoneRequest>) {
    Object.assign(this, obj);
  }
}

export class DnsCheckForwardZoneResponse {
  ip: string = '';
  status: 'not found' | 'validated' = 'not found';
  FQDN: string = '';

  constructor(obj: Partial<DnsCheckForwardZoneResponse>) {
    Object.assign(this, obj);
  }
}
