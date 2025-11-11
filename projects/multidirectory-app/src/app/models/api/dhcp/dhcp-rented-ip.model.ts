export class RentedIpAddress {
  constructor(
    public clientIpAddress?: string,
    public macAddress?: string,
    public name?: string,
    public expiration?: string
  ) {}
}
