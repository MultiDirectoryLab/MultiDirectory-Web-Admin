import { AccessPolicy } from "../../core/access-policy/access-policy";

export class PolicyCreateRequest {
    id?: string;
    name: string = '';
    netmasks: string[] = [];

    constructor(policy: AccessPolicy) {
        this.id = policy.id;
        this.name = policy.name;
        this.netmasks = policy.ipRange;        
    }
}