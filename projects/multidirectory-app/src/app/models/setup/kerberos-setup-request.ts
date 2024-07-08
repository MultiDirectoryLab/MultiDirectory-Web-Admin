export class KerberosSetup {
  mail: string = '';
  krbadmin_password: string = '';
  admin_password: string = '';
  stash_password: string = '';

  constructor(obj: Partial<KerberosSetup>) {
    Object.assign(this, obj);
  }
}
