import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { TranslocoPipe } from '@jsverse/transloco';
import { DropdownComponent, DropdownOption, TextareaComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-properties-address',
  templateUrl: './user-properties-address.component.html',
  styleUrls: ['./user-properties-address.component.scss'],
  imports: [TranslocoPipe, TextareaComponent, FormsModule, TextboxComponent, DropdownComponent],
})
export class UserPropertiesAddressComponent implements AfterViewInit, OnDestroy {
  @Input() accessor: LdapAttributes = {};
  unsubscribe = new Subject();
  countries = [
    new DropdownOption({ title: 'Russia', value: 'Russia' }),
    new DropdownOption({ title: 'Kazakhstan', value: 'Kazakhstan' }),
  ];

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

  ngAfterViewInit(): void {
    if (!this.accessor) {
      return;
    }
    if (this.accessor.country?.[0]) {
      this.country = this.countries?.find((x) => x.value == this.accessor.country[0])?.value ?? '';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(false);
    this.unsubscribe.complete();
  }
}
