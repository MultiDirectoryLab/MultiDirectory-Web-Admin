import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { UserPropertiesGeneralComponent } from './general/user-properties-general.component';
import { EntityAttributesComponent } from '../../entity-attributes/entity-attributes.component';
import { UserPropertiesAddressComponent } from './address/user-properties-address.component';
import { UserPropertiesProfileComponent } from './profile/user-properties-profile.component';
import { UserPropertiesAccountComponent } from './account/user-properties-account.component';
import { MemberOfComponent } from '../member-of/member-of.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-user-properties',
  styleUrls: ['./user-properties.component.scss'],
  templateUrl: 'user-properties.component.html',
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    UserPropertiesGeneralComponent,
    EntityAttributesComponent,
    UserPropertiesAddressComponent,
    UserPropertiesProfileComponent,
    UserPropertiesAccountComponent,
    TranslocoPipe,
    MemberOfComponent,
  ],
})
export class UserPropertiesComponent {
  @Input() accessor!: LdapAttributes;
  properties?: any[];
  propColumns = [
    { name: 'Имя', prop: 'name', flexGrow: 1 },
    { name: 'Значение', prop: 'val', flexGrow: 1 },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  onTabChanged() {
    this.cdr.detectChanges();
  }
}
