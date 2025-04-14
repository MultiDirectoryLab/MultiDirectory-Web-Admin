export class IpRange {
  start = '';
  end = '';

  constructor(obj: Partial<IpRange>) {
    Object.assign(this, obj);
  }
}

export type IpOption = IpRange | string;
