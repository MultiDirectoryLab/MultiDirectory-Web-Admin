import { AccessPolicy } from "../../core/access-policy/access-policy";
import { IpOption } from "../../core/access-policy/access-policy-ip-address";

export class PolicyPutRequest {
    id?: number;
    name: string = '';
    netmasks: IpOption[] = [];
    raw?: string;
    groups: string[] = [];
    priority?: number;
    mfa_status: number = 0;
    mfa_groups: string[] = [];
    constructor(policy: AccessPolicy) {
        this.id = policy.id;
        this.name = policy.name;
        this.netmasks = policy.ipRange;   
        this.groups = policy.groups;
        this.priority = policy.priority;  
        this.mfa_status = policy.mfaStatus ?? 0;
        this.mfa_groups = policy.mfaGroups ?? [];
    }
}