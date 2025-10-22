export type TReservationListStore = {
  list: { [key: string]: TReservationList };
};
export type TReservationList = Array<IReservation>;
export interface IReservation {
  subnet_id: number;
  ip_address: string;
  mac_address: string;
  hostname: string;
}
