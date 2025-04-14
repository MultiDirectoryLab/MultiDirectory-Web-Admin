import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { ComputerPropertiesAccountComponent } from '@features/ldap-properties/computer-properties/account/computer-properties-account.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { TabComponent, TabDirective, TabPaneComponent } from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-computer-properties',
  templateUrl: './computer-properties.component.html',
  styleUrls: ['./computer-properties.component.scss'],
  imports: [
    TabPaneComponent,
    TabComponent,
    TranslocoPipe,
    EntityAttributesComponent,
    ComputerPropertiesAccountComponent,
    TabDirective,
  ],
})
export class ComputerPropertiesComponent {
  private cdr = inject(ChangeDetectorRef);
  unsubscribe = new Subject<boolean>();
  readonly accessor = input.required<LdapAttributes>();

  onTabChanged() {
    this.cdr.detectChanges();
  }
}
