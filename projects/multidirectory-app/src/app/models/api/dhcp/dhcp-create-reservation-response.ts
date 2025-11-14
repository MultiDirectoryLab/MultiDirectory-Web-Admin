export class DhcpReservationRequest {
  subnet_id: string = '';
  ip_address: string = '';
  mac_address: string = '';
  hostname: string = '';

  constructor(obj: Partial<DhcpReservationRequest>) {
    Object.assign(this, obj);
  }
}

export type DhcpReservationResponse = null;
/**
 * Ответ на запрос перевода аренды в резервацию
 * @value null, если все аренды переведены успешно
 * @value LeaseToReservationPartialData, если часть аренд переведена успешно, а часть - нет
 */
export type DhcpLeaseToReservationResponse = null | LeaseToReservationPartialData[];

export class LeaseToReservationPartialData {
  constructor(
    public ip_address?: string,
    public mac_address?: string,
    public text?: string
  ) {}
}

export class DhcpDeleteReservationRequest {
  subnet_id: string = '';
  ip_address: string = '';
  mac_address: string = '';

  constructor(obj: Partial<DhcpDeleteReservationRequest>) {
    Object.assign(this, obj);
  }
}
