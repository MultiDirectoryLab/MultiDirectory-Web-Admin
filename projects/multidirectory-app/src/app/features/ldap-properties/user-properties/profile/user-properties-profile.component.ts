import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  DropdownComponent,
  DropdownOption,
  GroupComponent,
  RadiobuttonComponent,
  RadioGroupComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';

@Component({
  selector: 'app-user-properties-profile',
  styleUrls: ['./user-properties-profile.component.scss'],
  templateUrl: './user-properties-profile.component.html',
  imports: [
    GroupComponent,
    TranslocoPipe,
    TextboxComponent,
    FormsModule,
    RadiobuttonComponent,
    DropdownComponent,
    RadioGroupComponent,
  ],
})
export class UserPropertiesProfileComponent {
  @Input() accessor: LdapAttributes | null = null;
  homeDirectorySelection = 1;
  mountDrives = ['C:', 'Z:', 'D:'].map((x) => new DropdownOption({ value: x, title: x }));
}
