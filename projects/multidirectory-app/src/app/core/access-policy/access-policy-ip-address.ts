export class IpRange {
    start: string = '';
    end: string = '';

    constructor(obj: Partial<IpRange>) {
        Object.assign(this, obj);
    }
}

export type IpOption = IpRange | string;