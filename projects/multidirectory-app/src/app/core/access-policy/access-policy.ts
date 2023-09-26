export class AccessPolicy {
    id?: number;
    name: string = '';
    ipRange: string[] = [];
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