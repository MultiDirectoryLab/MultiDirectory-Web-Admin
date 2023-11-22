import { Injectable } from "@angular/core";
import { MultidirectoryApiService } from "./multidirectory-api.service";
import { SearchQueries } from "../core/ldap/search";
import { map, of, switchMap, tap, zip } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { EntityAttribute } from "../components/ldap-browser/entity-properties/entity-attributes/entity-attributes.component";
import { LdapNavigationService } from "./ldap-navigation.service";
import { translate } from "@ngneat/transloco";

@Injectable({
    providedIn: 'root'
})
export class LdapPropertiesService {
    READONLY = ['distinguishedName', 'gidNumber', 'uidNumber']
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService) {}
    
    loadData(entityId: string, oldValues?: EntityAttribute[]) {
        return this.api.search(
            SearchQueries.getSchema()
        ).pipe(
            map(schema => {
                const types = schema.search_result?.[0]?.partial_attributes.find(x => x.type == "attributeTypes")?.vals
                if(!types) {
                    this.toastr.error(translate('entity-attributes.unable-retrieve-schema'));
                    return;           
                }
                const attributes: EntityAttribute[] = [];
                for(let type of types)  {
                    const extractName = /NAME \'([A-Za-z]+)\'/gi;
                    const nameGroup = extractName.exec(type);
                    if(!nameGroup || nameGroup.length < 2) {
                        continue;      
                    }
                    const isWritable =  this.READONLY.findIndex(x => x == nameGroup![1]) < 0;
                    attributes.push(new EntityAttribute(nameGroup[1], '', false, isWritable));
                };
                return attributes;
            }),
            switchMap(attributes => {
                return zip(
                    of(attributes), 
                    this.api.search(SearchQueries.getProperites(entityId ?? '')).pipe(map(x => {
                        return x.search_result[0].partial_attributes.flatMap( x => {
                            const isWritable =  this.READONLY.findIndex(y => y == x.type) < 0;
                            return new EntityAttribute(x.type, x.vals.join(';'), false, isWritable);
                        });
                    }))
                )
            }),
            tap(([attributes, values]) => {
                if(!oldValues) {
                    return;
                }
                oldValues.forEach(oldValue => {
                    if(!oldValue.changed) {
                        return;
                    }
                    if(Array.isArray(oldValue.val)) {
                        oldValue.val = oldValue.val.join(';')
                    }
                    const vals = values.filter(x => x.name == oldValue.name);
                    if(!vals || vals.length == 0) {
                        values.push(oldValue);
                        return;
                    }
                    let newVal;
                    if(vals.length > 1) {
                        newVal = vals.map(x => x.val).join(';');
                    } else {
                        newVal = vals[0].val;
                    }
                    oldValue.val = newVal;
                    oldValue.changed = true;
                    oldValue.writable = this.READONLY.findIndex(x => x == oldValue.name) < 0;
                });
            }),
            map(([attributes, values]) => {
                if(!attributes) {
                    attributes = [];
                }
                for(let val of values) {
                    const indx = attributes.findIndex(x => x.name == val.name);
                    let multipleValues = val.val.split(';');
                    if(multipleValues.length <= 0) {
                        return attributes;
                    }
                    const newAttributes = multipleValues.map(x => new EntityAttribute(val.name, x, val.changed, val.writable));
                    if(indx >= 0) {
                        attributes[indx].val = newAttributes[0].val;
                        attributes[indx].changed = newAttributes[0].changed;
                        newAttributes.slice(1).forEach(x => {
                            attributes!.splice(indx, 0, x);
                        });
                    } else {
                        attributes = attributes.concat(...newAttributes);
                    }
                   
                }
                return attributes;
            })
        );
    }

}