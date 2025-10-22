export type TSubnetsList = Array<Subnet>;
export interface Subnet {
  id: string;
  subnet: string;
  pool: string[];
  valid_lifetime: number;
  default_gateway: string;
}
