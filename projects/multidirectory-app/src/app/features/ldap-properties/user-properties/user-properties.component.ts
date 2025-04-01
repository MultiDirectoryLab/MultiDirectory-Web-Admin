import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { TranslocoPipe } from '@jsverse/transloco';
import { TabComponent, TabDirective, TabPaneComponent } from 'multidirectory-ui-kit';
import { EntityAttributesComponent } from '../../entity-attributes/entity-attributes.component';
import { MemberOfComponent } from '../member-of/member-of.component';
import { UserPropertiesAccountComponent } from './account/user-properties-account.component';
import { UserPropertiesAddressComponent } from './address/user-properties-address.component';
import { UserPropertiesGeneralComponent } from './general/user-properties-general.component';
import { UserPropertiesProfileComponent } from './profile/user-properties-profile.component';

@Component({
  selector: 'app-user-properties',
  styleUrls: ['./user-properties.component.scss'],
  templateUrl: 'user-properties.component.html',
  imports: [
    TabPaneComponent,
    TabComponent,
    TranslocoPipe,
    UserPropertiesGeneralComponent,
    TabDirective,
    EntityAttributesComponent,
    UserPropertiesAddressComponent,
    UserPropertiesProfileComponent,
    UserPropertiesAccountComponent,
    MemberOfComponent,
  ],
})
export class UserPropertiesComponent {
  private cdr = inject(ChangeDetectorRef);
  readonly accessor = input.required<LdapAttributes>();
  properties?: any[];
  propColumns = [
    { name: 'Имя', prop: 'name', flexGrow: 1 },
    { name: 'Значение', prop: 'val', flexGrow: 1 },
  ];

  onTabChanged() {
    this.cdr.detectChanges();
  }
}
