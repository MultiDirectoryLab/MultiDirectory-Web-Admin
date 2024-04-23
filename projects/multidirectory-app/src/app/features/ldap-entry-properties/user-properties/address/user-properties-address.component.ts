import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { DropdownOption } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { LdapAttributes } from "@core/ldap/ldap-entity-proxy";
import { AttributeService } from "@services/attributes.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-user-properties-address',
    templateUrl: './user-properties-address.component.html',
    styleUrls: ['./user-properties-address.component.scss']
})
export class UserPropertiesAddressComponent implements AfterViewInit, OnDestroy {
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

    accessor: LdapAttributes = {};
    unsubscribe = new Subject();

    constructor(private attributes: AttributeService, private cdr: ChangeDetectorRef, private toastr: ToastrService) {
    }
    
    ngAfterViewInit(): void {
        this.attributes._entityAccessorRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            if(!x) {
                return;
            }
            this.accessor = x;
            if(this.accessor.country?.[0]) {
                this.country = this.countries?.find(x => x.value == this.accessor.country[0])?.value ?? '';
            }
        })
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(false);
        this.unsubscribe.complete();
    }

    countries = [
        new DropdownOption({ title: 'Russia', value: 'Russia' }),
        new DropdownOption({ title: 'Kazakhstan', value: 'Kazakhstan' })
    ];
}