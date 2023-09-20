import { GroupSelection } from "../entities/entities-selection";
// AccessPolicy
export class AccessPolicy {
    id?: string ;
    name: string = '';
    ipRange: string[] = [];
    enabled: boolean = false;
    groups: GroupSelection[] = [];
    
    constructor(obj: Partial<AccessPolicy> = {}) {
        Object.assign(this, obj);
        this.id = '';
    }

    setId(id: string) {
        this.id = id;
        return this;
    }
}