
export class PasswordPolicy {
    id?: number;
    name: string = '';
    // Enforce password history 
    // Count of passwords remembered 
    enforcePasswordHistory: number = 0;
    
    // Maximum password age 90 days 
    maximumPasswordAge: number = 90;

    // Minimum password age 0 days 
    minimumPasswordAge: number = 0;

    // Minimum password length 5 characters 
    minimumPasswordLength: number = 5;

    // Password must meet complexity requirements Disabled 
    passwordMustMeetComplexityRequirements: boolean = false;
    // Store passwords using reversible encryption Disabled 
    useReversibleEncryption = false;

    constructor(obj: Partial<PasswordPolicy> = {}) {
        Object.assign(this, obj);
        this.id = undefined;
    }

    setId(id: number) {
        this.id = id;
        return this;
    }
}