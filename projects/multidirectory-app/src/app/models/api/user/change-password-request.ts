export class ChangePasswordRequest {
  identity = '';
  new_password = '';
  old_password = '';

  constructor(obj?: Partial<ChangePasswordRequest>) {
    Object.assign(this, obj);
  }
}
