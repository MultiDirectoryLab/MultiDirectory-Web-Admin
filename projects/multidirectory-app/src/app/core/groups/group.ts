export class Group {
    dn?: string;
    path?: string;
    name?: string;
    
    constructor(obj: Partial<Group>) {
        Object.assign(this, obj);
    }
}