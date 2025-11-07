export class ChangePasswordRequest {
  identity = '';
  old_password = '';
  new_password = '';

  constructor(obj?: Partial<ChangePasswordRequest>) {
    Object.assign(this, obj);
  }
}
