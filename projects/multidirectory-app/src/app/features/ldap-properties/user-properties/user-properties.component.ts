import { ChangeDetectorRef, Component, Inject, Input, OnDestroy } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { MemberOfComponent } from '@features/ldap-properties/member-of/member-of.component';
import { UserPropertiesAccountComponent } from '@features/ldap-properties/user-properties/account/user-properties-account.component';
import { UserPropertiesAddressComponent } from '@features/ldap-properties/user-properties/address/user-properties-address.component';
import { UserPropertiesGeneralComponent } from '@features/ldap-properties/user-properties/general/user-properties-general.component';
import { UserPropertiesProfileComponent } from '@features/ldap-properties/user-properties/profile/user-properties-profile.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ModalInjectDirective,
  TabComponent,
  TabDirective,
  TabPaneComponent,
} from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

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
export class UserPropertiesComponent implements OnDestroy {
  unsubscribe = new Subject<boolean>();
  @Input() accessor!: LdapAttributes;
  properties?: any[];
  propColumns = [
    { name: 'Имя', prop: 'name', flexGrow: 1 },
    { name: 'Значение', prop: 'val', flexGrow: 1 },
  ];

  constructor(
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  onTabChanged() {
    this.modalControl.modal?.resizeToContentHeight();
    this.cdr.detectChanges();
  }
}
