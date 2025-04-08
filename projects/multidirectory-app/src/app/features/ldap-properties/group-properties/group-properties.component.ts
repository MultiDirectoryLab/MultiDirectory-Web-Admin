import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { MemberOfComponent } from '@features/ldap-properties/member-of/member-of.component';
import { MembersComponent } from '@features/ldap-properties/members/members.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ModalInjectDirective,
  TabComponent,
  TabDirective,
  TabPaneComponent,
} from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-group-properties',
  templateUrl: './group-properties.component.html',
  styleUrls: ['./group-properties.component.scss'],
  imports: [
    TabPaneComponent,
    TabComponent,
    TranslocoPipe,
    EntityAttributesComponent,
    MemberOfComponent,
    MembersComponent,
    TabDirective,
  ],
})
export class GroupPropertiesComponent {
  unsubscribe = new Subject<boolean>();
  @Input() accessor!: LdapAttributes;

  constructor(
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
  ) {}

  onTabChanged() {
    this.modalControl.modal?.resizeToContentHeight();
    this.cdr.detectChanges();
  }
}
