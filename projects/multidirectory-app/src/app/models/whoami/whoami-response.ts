export class WhoamiResponse {
  id = 0;
  sam_accout_name = '';
  user_principal_name = '';
  mail = '';
  display_name = '';
  dn = '';
  jpegPhoto?: string;
  constructor(obj: Partial<WhoamiResponse>) {
    Object.assign(this, obj);
  }
}
