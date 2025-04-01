import { Component, Input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-user-properties-profile',
  styleUrls: ['./user-properties-profile.component.scss'],
  templateUrl: './user-properties-profile.component.html',
  standalone: true,
  imports: [MultidirectoryUiKitModule, FormsModule, TranslocoPipe],
})
export class UserPropertiesProfileComponent {
  @Input() accessor: LdapAttributes | null = null;
  homeDirectorySelection: number = 1;
}
