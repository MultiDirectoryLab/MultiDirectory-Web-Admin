import { ChangeDescription } from "./ldap-change";
import { LdapEntity } from "./ldap-entity";
import { PartialAttribute } from "./ldap-partial-attribute";

export class Trackable<T> {
    current: T;
    original: T;

    constructor(obj: T) {
        this.current = obj;
        this.original = JSON.parse(JSON.stringify(obj));
    }
}

export class LdapAttributes {
    [type: string]: string[];

    constructor(props: PartialAttribute[]) {
        props.forEach(prop => {
            this[prop.type] = prop.vals;
        });
    }
}


export class LdapAttributesProxyHandler {
    _original: LdapAttributes;
    _entity: LdapEntity;
    _changes: ChangeDescription[] = [];
    constructor(entity: LdapEntity, attributes: LdapAttributes) {
        this._original = JSON.parse(JSON.stringify(attributes));
        this._entity = entity;
    }

    get(target: LdapAttributes, key: string) {
        if(key.toLocaleLowerCase() == '$entitydn') {
            return [this._entity.id];
        }
        if(key.toLocaleLowerCase() == '$changes') {
            return this._changes;
        }
        if(key.startsWith('$')) {
            return this._original[key.slice(1)];
        }
        return target[key];
    }

    set(target: LdapAttributes, key: string, value: string[] | string | ChangeDescription[]) {
        if(key == '$changes' && Array.isArray(value) && value.length > 0 && value[0] instanceof ChangeDescription) {
            this._changes = <ChangeDescription[]>value;
        } else if(Array.isArray(value) ) {
            target[key] = <string[]>value;
        } else {
            target[key] = [value];
        }
        return true;
    }
}

export class LdapChangableTrack {
    constructor(private attributes: LdapAttributes, private original: LdapAttributes) {}

 /*   getChanges(): ChangeDescription[] {
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
    }*/
}