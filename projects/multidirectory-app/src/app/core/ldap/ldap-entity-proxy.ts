import { ChangeDescription } from "./ldap-change";
import { LdapEntryNode } from "./ldap-entity";
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
    [type: string]: any[];

    constructor(props: PartialAttribute[]) {
        props.forEach(prop => {
            this[prop.type] = prop.vals;
        });
    }
}


export class LdapAttributesProxyHandler {
    _original: LdapAttributes;
    _entity: LdapEntryNode;
    _changes: ChangeDescription[] = [];
    constructor(entity: LdapEntryNode, attributes: LdapAttributes) {
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