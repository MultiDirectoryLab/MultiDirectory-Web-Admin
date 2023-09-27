import { IpOption } from "./access-policy-ip-address";

export class AccessPolicy {
    id?: number;
    name: string = '';
    ipRange: IpOption[] = [];
    enabled: boolean = false;
    groups: string[] = [];
    priority?: number;
    constructor(obj: Partial<AccessPolicy> = {}) {
        Object.assign(this, obj);
        this.id = undefined;
    }

    setId(id: number) {
        this.id = id;
        return this;
    }
}