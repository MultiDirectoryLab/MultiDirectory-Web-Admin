export class DhcpServiceResponse {
  type = '';

  constructor(obj: Partial<DhcpServiceResponse>) {
    Object.assign(this, obj);
  }
}
