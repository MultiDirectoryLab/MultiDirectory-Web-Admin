import { Constants } from '@core/constants';
import { DnsStatuses } from '@models/api/dns/dns-statuses';

export class DhcpCreateSubnetRequest {
  subnet = '';
  pool = '';
  valid_lifetime = 0;
  default_gateway: string | null = null;

  constructor(obj: Partial<DhcpCreateSubnetRequest>) {
    Object.assign(this, obj);
  }
}

export interface DhcpCreateSubnetResponse {
  status: 'string';
  message: 'string';
}

export class DhcpUpdateSubnetRequest {
  subnet = '';
  pool = '';
  default_gateway: string | null = null;

  constructor(obj: Partial<DhcpUpdateSubnetRequest>) {
    Object.assign(this, obj);
  }
}
