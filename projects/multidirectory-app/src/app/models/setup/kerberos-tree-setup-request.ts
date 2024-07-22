import { SetupRequest } from './setup-request';

export class KerberosTreeSetupRequest {
  mail: string = '';
  krbadmin_password: string = '';

  constructor(obj: Partial<KerberosTreeSetupRequest>) {
    Object.assign(this, obj);
  }

  flll_from_setup_request(req: SetupRequest): KerberosTreeSetupRequest {
    this.mail = req.mail;
    this.krbadmin_password = req.krbadmin_password;
    return this;
  }
}
