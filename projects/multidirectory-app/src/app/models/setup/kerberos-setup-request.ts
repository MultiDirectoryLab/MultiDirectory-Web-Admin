import { SetupRequest } from './setup-request';

export class KerberosSetup {
  mail: string = '';
  krbadmin_password: string = '';
  admin_password: string = '';
  stash_password: string = '';

  constructor(obj: Partial<KerberosSetup>) {
    Object.assign(this, obj);
  }

  flll_from_setup_request(req: SetupRequest): KerberosSetup {
    this.mail = req.mail;
    this.krbadmin_password = req.krbadmin_password;
    this.admin_password = req.krbadmin_password;
    this.stash_password = req.stash_password;
    return this;
  }
}
