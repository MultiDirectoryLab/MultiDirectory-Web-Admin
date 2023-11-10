export class PolicyResponse {
    enabled: boolean = false;
    id: number = 0;
    name: string = '';
    netmasks: string[] = [];
    groups: string[] = [];
    priority = 0;
    mfa_status = 0;
    mfa_groups: string[] = [];
}