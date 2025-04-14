export class AddPrincipalRequest {
  primary = '';
  instance = '';

  constructor(principalName: string) {
    [this.primary, this.instance] = principalName.split('/');
  }
}
