export class SetupMultifactorRequest {
    mfa_key: string = '';
    mfa_secret: string = '';
    is_ldap_scope: boolean = false;
    constructor(obj: Partial<SetupMultifactorRequest>) {
        Object.assign(this, obj);
    }
}