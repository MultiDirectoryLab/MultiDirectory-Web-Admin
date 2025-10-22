export type TRentedListStore = {
  list: { [key: string]: TRentedList };
};
export type TRentedList = Array<IRented>;
export interface IRented {
  subnet_id: number;
  ip_address: string;
  mac_address: string;
  hostname: string;
  expires: string;
}
