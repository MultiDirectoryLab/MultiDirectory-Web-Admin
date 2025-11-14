export type TReservationListStore = {
  list: { [key: string]: TReservationList };
};
export type TReservationList = Array<IReservation>;
export interface IReservation {
  subnet_id: string;
  ip_address: string;
  mac_address: string;
  hostname: string;
}

export class ReservationDataWrapper {
  constructor(
    public reservation: IReservation,
    public exists: boolean
  ) {}
}
