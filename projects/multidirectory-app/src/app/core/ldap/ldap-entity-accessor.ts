import { LdapOperation } from "../../models/entry/update-request";
import { ChangeDescription } from "./ldap-change";
import { LdapEntity } from "./ldap-entity";
import { PartialAttribute } from "./ldap-partial-attribute";

export class LdapEntityAccessor {
    private _originalProperties: PartialAttribute[] = [];
    constructor(private _entity: LdapEntity, private _properties: PartialAttribute[]) {
        this._originalProperties = JSON.parse(JSON.stringify(this._properties));
    }
    
    get dn(): string {
        return this._entity?.entry?.object_name ?? '';
    } 
    
    static STREET_ADDRESS: string = 'streetAddress';
    get streetAddress(): string {
        const vals =  this._properties.find(x => x.type === LdapEntityAccessor.STREET_ADDRESS)?.vals ?? [];
        return vals[0];
    }
    set streetAddress(address: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.STREET_ADDRESS);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.STREET_ADDRESS, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = address;
    }


    static POSTAL_ADDRESS = 'postalAddress';
    get postalAddress(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.POSTAL_ADDRESS)?.vals ?? [];
        return vals[0];
    }
    set postalAddress(postalAddress: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.POSTAL_ADDRESS);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.POSTAL_ADDRESS, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = postalAddress;
    }

    static LOCATION = 'l';
    get location(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.LOCATION)?.vals ?? [];
        return vals[0];
    }
    set location(location: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.LOCATION);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.LOCATION, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = location;
    }

    
    static STATE = 'st';
    get state(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.STATE)?.vals ?? [];
        return vals[0];
    }
    set state(location: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.STATE);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.STATE, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = location;
    }

    static POSTAL_CODE = 'postalCode';
    get postalCode(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.POSTAL_CODE)?.vals ?? [];
        return vals[0];
    }
    set postalCode(location: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.POSTAL_CODE);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.POSTAL_CODE, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = location;
    }


    static COUNTRY = 'co';
    get country(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.COUNTRY)?.vals ?? [];
        return vals[0];
    }
    set country(country: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.COUNTRY);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.COUNTRY, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = country;
    }


    
    static DISPLAY_NAME = 'displayName';
    get displayName(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.DISPLAY_NAME)?.vals ?? [];
        return vals[0];
    }
    set displayName(displayName: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.DISPLAY_NAME);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.DISPLAY_NAME, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = displayName;
    }

    static SURNAME = 'sn';
    get surname(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.SURNAME)?.vals ?? [];
        return vals[0];
    }
    set surname(surname: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.SURNAME);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.SURNAME, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = surname;
    }

    static INITIALS = 'initials';
    get initials(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.INITIALS)?.vals ?? [];
        return vals[0];
    }
    set initials(initials: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.INITIALS);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.INITIALS, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = initials;
    }

    static GIVEN_NAME = 'givenName';
    get givenName(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.GIVEN_NAME)?.vals ?? [];
        return vals[0];
    }
    set givenName(givenName: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.GIVEN_NAME);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.GIVEN_NAME, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = givenName;
    }

    static MAIL = 'mail';
    get mail(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.MAIL)?.vals ?? [];
        return vals[0];
    }
    set mail(mail: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.MAIL);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.MAIL, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = mail;
    }

    static OFFICE = 'physicalDeliveryOfficeName';
    get office(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.OFFICE)?.vals ?? [];
        return vals[0];
    }
    set office(office: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.OFFICE);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.OFFICE, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = office;
    }

    static DESCRIPTION = 'description';
    get description(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.DESCRIPTION)?.vals ?? [];
        return vals[0];
    }
    set description(description: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.DESCRIPTION);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.DESCRIPTION, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = description;
    }

    
    static TELEPHONE_PRIMARY = 'telephoneNumber';
    get telephoneNumber(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.TELEPHONE_PRIMARY)?.vals ?? [];
        return vals[0];
    }
    set telephoneNumber(telephoneNumber: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.TELEPHONE_PRIMARY);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.TELEPHONE_PRIMARY, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = telephoneNumber;
    }

    static WEBPAGE_PRIMARY = 'wWWHomePage';
    get webpage(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.WEBPAGE_PRIMARY)?.vals ?? [];
        return vals[0];
    }
    set webpage(webpage: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.WEBPAGE_PRIMARY);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.WEBPAGE_PRIMARY, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = webpage;
    }

    static PROFILE_PATH = 'profilePath';
    get profilePath(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.PROFILE_PATH)?.vals ?? [];
        return vals[0];
    }
    set profilePath(profilePath: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.PROFILE_PATH);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.PROFILE_PATH, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = profilePath;
    }

    static SCRIPT_PATH = 'scriptPath';
    get scriptPath(): string {
        const vals = this._properties.find(x => x.type == LdapEntityAccessor.SCRIPT_PATH)?.vals ?? [];
        return vals[0];
    }
    set scriptPath(scriptPath: string) {
        let vals = this._properties.find(x => x.type === LdapEntityAccessor.SCRIPT_PATH);
        if(!vals) {
            vals = { type:  LdapEntityAccessor.SCRIPT_PATH, vals: [""] }
            this._properties.push(vals);
        }
        vals.vals[0] = scriptPath;
    }
    
    getChanges(): ChangeDescription[] {
        let changes: ChangeDescription[] = [];
        // to add 
        const toAdd = this._properties.filter(currentAttribute => {
            return this._originalProperties.findIndex(y => currentAttribute.type === y.type) < 0;
        }) ?? [];
        changes = changes.concat(toAdd.map(y => new ChangeDescription({
            operation: LdapOperation.Add,
            attribute: y
        })));
        // to replace
        const toReplace = this._properties.filter(currentAttribute => {
            const currentVals = currentAttribute.vals;
            const originalVals = this._originalProperties.find(y => currentAttribute.type === y.type)?.vals ?? [];
            return !currentVals.some(x => originalVals.includes(x));
        }) ?? [];
        changes = changes.concat(toReplace.map(y => new ChangeDescription({
            operation: LdapOperation.Replace,
            attribute: y
        })));
        return changes;
    }
}