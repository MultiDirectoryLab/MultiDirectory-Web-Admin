import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { MembersComponent } from '@features/ldap-properties/members/members.component';
import { MemberOfComponent } from '@features/ldap-properties/member-of/member-of.component';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';

@Component({
  selector: 'app-group-properties',
  templateUrl: './group-properties.component.html',
  styleUrls: ['./group-properties.component.scss'],
  standalone: true,
  imports: [
    MultidirectoryUiKitModule,
    TranslocoPipe,
    MembersComponent,
    MemberOfComponent,
    EntityAttributesComponent,
  ],
})
export class GroupPropertiesComponent {
  unsubscribe = new Subject<boolean>();
  @Input() accessor!: LdapAttributes;

  constructor(private cdr: ChangeDetectorRef) {}

  onTabChanged() {
    this.cdr.detectChanges();
  }
}
