export class SetupRequest {
  domain: string = '';
  username: string = '';
  user_principal_name: string = '';
  display_name: string = '';
  mail: string = '';
  password: string = '';
  repeatPassword: string = '';

  setupKdc = false;
  krbadmin_password: string = '';
  krbadmin_password_repeat: string = '';

  stash_password: string = '';
  stash_password_repeat: string = '';
}
