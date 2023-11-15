import { Injectable } from "@angular/core";
import { MultidirectoryApiService } from "./multidirectory-api.service";
import { SearchQueries } from "../core/ldap/search";
import { map, of, switchMap, tap, zip } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { EntityAttribute } from "../components/ldap-browser/entity-properties/entity-attributes/entity-attributes.component";
import { LdapNavigationService } from "./ldap-navigation.service";

@Injectable({
    providedIn: 'root'
})
export class LdapPropertiesService {
   
    constructor(private api: MultidirectoryApiService, private toastr: ToastrService, private navigation: LdapNavigationService) {}
    
    loadData(oldValues?: EntityAttribute[]) {
        return this.api.search(
            SearchQueries.getSchema()
        ).pipe(
            map(schema => {
                const types = schema.search_result?.[0]?.partial_attributes.find(x => x.type == "attributeTypes")?.vals
                if(!types) {
                    this.toastr.error('Не удалось получить схему');
                    return;           
                }
                const attributes: EntityAttribute[] = [];
                for(let type of types)  {
                    const extractName = /NAME \'([A-Za-z]+)\'/gi;
                    const nameGroup = extractName.exec(type);
                    if(!nameGroup || nameGroup.length < 2) {
                        continue;      
                    }
                    attributes.push(new EntityAttribute(nameGroup[1], ''));
                };
                return attributes;
            }),
            switchMap(attributes => {
                return zip(
                    of(attributes), 
                    this.api.search(SearchQueries.getProperites(this.navigation.selectedEntity?.[0]?.id ?? '')).pipe(map(x => {
                        return x.search_result[0].partial_attributes.flatMap( x => {
                            return new EntityAttribute(x.type, x.vals.join(';'));
                        });
                    }))
                )
            }),
            tap(([attributes, values]) => {
                if(!oldValues) {
                    return;
                }
                oldValues.forEach(element => {
                    if(!element.changed) {
                        return;
                    }
                    if(Array.isArray(element.val)) {
                        element.val = element.val.join(';')
                    }
                    const vals = values.filter(x => x.name == element.name);
                    if(!vals || vals.length == 0) {
                        values.push(element);
                        return;
                    }
                    let newVal;
                    if(vals.length > 1) {
                        newVal = vals.map(x => x.val).join(';');
                    } else {
                        newVal = vals[0].val;
                    }
                    element.val = newVal;
                    element.changed = true;
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
                    const newAttributes = multipleValues.map(x => new EntityAttribute(val.name, x, val.changed));
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