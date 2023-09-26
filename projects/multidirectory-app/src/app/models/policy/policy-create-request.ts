import { AccessPolicy } from "../../core/access-policy/access-policy";

export class PolicyCreateRequest {
    id?: number;
    name: string = '';
    netmasks: string[] = [];
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