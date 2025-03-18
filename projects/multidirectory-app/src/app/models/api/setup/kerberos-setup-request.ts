import { SetupRequest } from './setup-request';

export class KerberosSetupRequest {
  krbadmin_password: string = '';
  admin_password: string = '';
  stash_password: string = '';

  constructor(obj: Partial<KerberosSetupRequest>) {
    Object.assign(this, obj);
  }

  flll_from_setup_request(req: SetupRequest): KerberosSetupRequest {
    this.krbadmin_password = req.krbadmin_password;
    this.admin_password = req.password;
    this.stash_password = req.stash_password;
    return this;
  }
}
