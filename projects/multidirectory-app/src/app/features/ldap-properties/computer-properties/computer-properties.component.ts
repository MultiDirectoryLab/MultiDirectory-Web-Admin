import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { ComputerPropertiesAccountComponent } from '@features/ldap-properties/computer-properties/account/computer-properties-account.component';

@Component({
  selector: 'app-computer-properties',
  templateUrl: './computer-properties.component.html',
  styleUrls: ['./computer-properties.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    TranslocoPipe,
    EntityAttributesComponent,
    ComputerPropertiesAccountComponent,
  ],
})
export class ComputerPropertiesComponent {
  unsubscribe = new Subject<boolean>();
  @Input() accessor!: LdapAttributes;

  constructor(private cdr: ChangeDetectorRef) {}

  onTabChanged() {
    this.cdr.detectChanges();
  }
}
