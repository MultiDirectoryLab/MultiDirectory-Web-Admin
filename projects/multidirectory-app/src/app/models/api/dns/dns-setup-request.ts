import { Constants } from '@core/constants';
import { DnsStatuses } from './dns-statuses';

export class DnsSetupRequest {
  dns_ip_address?: string = undefined;
  default_ttl? = Constants.DnsTTL;
  tsig_key?: string = undefined;

  constructor(obj: Partial<DnsSetupRequest>) {
    Object.assign(this, obj);
  }
}
