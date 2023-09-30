import { AccessPolicy } from "../../core/access-policy/access-policy";
import { IpOption } from "../../core/access-policy/access-policy-ip-address";

export class PolicyCreateRequest {
    id?: number;
    name: string = '';
    netmasks: IpOption[] = [];
    raw?: string;
    groups: string[] = [];
    priority?: number;

    constructor(policy: AccessPolicy) {
        this.id = policy.id;
        this.name = policy.name;
        this.netmasks = policy.ipRange;   
        this.groups = policy.groups;
        this.priority = policy.priority;     
    }
}