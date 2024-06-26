import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { DropdownOption, ModalInjectDirective } from 'multidirectory-ui-kit';
import { Subject, takeUntil } from 'rxjs';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';

@Component({
  selector: 'app-user-properties-address',
  templateUrl: './user-properties-address.component.html',
  styleUrls: ['./user-properties-address.component.scss'],
})
export class UserPropertiesAddressComponent implements AfterViewInit, OnDestroy {
  private _country?: DropdownOption;
  get country(): string {
    return this._country?.value;
  }
  set country(value: string) {
    this._country = this.countries.find((x) => x.value == value);
    if (this.accessor) {
      this.accessor.country = [value];
    }
  }

  unsubscribe = new Subject();
  accessor: LdapAttributes = {};

  constructor(private modalControl: ModalInjectDirective) {}

  ngAfterViewInit(): void {
    if (!this.modalControl.contentOptions?.accessor) {
      return;
    }
    this.accessor = this.modalControl.contentOptions?.accessor;
    if (this.accessor.country?.[0]) {
      this.country = this.countries?.find((x) => x.value == this.accessor.country[0])?.value ?? '';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(false);
    this.unsubscribe.complete();
  }

  countries = [
    new DropdownOption({ title: 'Russia', value: 'Russia' }),
    new DropdownOption({ title: 'Kazakhstan', value: 'Kazakhstan' }),
  ];
}
