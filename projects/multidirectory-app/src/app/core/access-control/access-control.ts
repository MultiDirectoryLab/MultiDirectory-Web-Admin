
export class GroupSelection {
    dn: string = '';
    name: string = '';
    selected = false;
    constructor(obj: Partial<GroupSelection>) {
        Object.assign(this, obj)
    }
}

export class AccessControlClient {
    domain: string = '';
    ipRange: string[] = [];
    enabled: boolean = false;
    groups: GroupSelection[] = [];
    
    constructor(obj: Partial<AccessControlClient> = {}) {
        Object.assign(this, obj);
    }
}