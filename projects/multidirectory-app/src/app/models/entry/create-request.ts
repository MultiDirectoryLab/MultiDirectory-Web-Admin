export class LdapPartialAttribute {
    type: string = '';
    vals: string[] = [];

    
    constructor(obj: Partial<LdapPartialAttribute>) {
        Object.assign(this, obj);
    }
}

export class CreateEntryRequest {
    entry: string = '';
    attributes: LdapPartialAttribute[] = [];
    password: string = '';
    
    constructor(obj: Partial<CreateEntryRequest>) {
        Object.assign(this, obj);
    }
  }