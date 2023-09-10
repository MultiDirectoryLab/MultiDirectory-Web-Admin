export class AccessControlClient {
    domain: string = '';
    ipRange: string[] = [];
    enabled: boolean = false;
    groups: string[] = [];
    
    constructor(obj: Partial<AccessControlClient> = {}) {
        Object.assign(this, obj);
    }
}