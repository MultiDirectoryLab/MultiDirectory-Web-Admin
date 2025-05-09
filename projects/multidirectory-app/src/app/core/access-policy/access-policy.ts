import { IpOption } from './access-policy-ip-address';

export class AccessPolicy {
  id?: number;
  name = '';
  ipRange: IpOption[] = [];
  enabled = false;
  groups: string[] = [];
  priority?: number;
  mfaStatus?: number;
  mfaGroups: string[] = [];
  bypassNoConnection = false;
  bypassServiceFailure = false;
  isHttp = false;
  isLdap = false;
  isKerberos = false;

  constructor(obj: Partial<AccessPolicy> = {}) {
    Object.assign(this, obj);
    this.id = undefined;
  }

  setId(id: number) {
    this.id = id;
    return this;
  }
}
