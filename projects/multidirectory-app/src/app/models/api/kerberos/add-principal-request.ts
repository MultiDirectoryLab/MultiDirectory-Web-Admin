export class AddPrincipalRequest {
  primary: string = '';
  instance: string = '';

  constructor(principalName: string) {
    [this.primary, this.instance] = principalName.split('/');
  }
}
