export class ChangePasswordRequest {
  identity: string = '';
  new_password: string = '';

  constructor(obj?: Partial<ChangePasswordRequest>) {
    Object.assign(this, obj);
  }
}
