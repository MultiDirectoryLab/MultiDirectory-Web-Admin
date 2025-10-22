export type TLeasesListStore = {
  list: { [key: string]: TLeasesList };
};
export type TLeasesList = Array<ILease>;
export interface ILease {
  subnet_id: number;
  ip_address: string;
  mac_address: string;
  hostname: string;
  expires: string;
}
