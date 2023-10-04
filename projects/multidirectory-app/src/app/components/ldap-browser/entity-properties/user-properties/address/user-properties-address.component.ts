import { AfterViewInit, ChangeDetectorRef, Component, Input } from "@angular/core";
import { DropdownOption } from "multidirectory-ui-kit";
import { LdapAttributes } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-proxy";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";
import { take } from "rxjs";

@Component({
    selector: 'app-user-properties-address',
    templateUrl: './user-properties-address.component.html',
    styleUrls: ['./user-properties-address.component.scss']
})
export class UserPropertiesAddressComponent {
    private _country?: DropdownOption;
    get country(): string {
        return this._country?.value;
    }
    set country(value: string) {
        this._country = this.countries.find(x => x.value == value);
        if(this.accessor) {
            this.accessor.country = [value];
        }
    }
    private _accessor: LdapAttributes = {};
    get accessor(): LdapAttributes {
        return this._accessor;
    }
    @Input() set accessor(accessor: LdapAttributes)  {
        this._accessor = accessor;
        this.country = this.accessor.country?.[0];
        this.cdr.detectChanges();
    }
    constructor(private navigation: LdapNavigationService, private cdr: ChangeDetectorRef) {
    }

    countries = [
        new DropdownOption({ title: 'Russia', value: 'Russia' }),
        new DropdownOption({ title: 'Kazakhstan', value: 'Kazakhstan' })
    ];
}