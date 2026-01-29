import { ChangeDetectorRef, Component, computed, effect, inject, input, OnInit, ViewChild } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { TranslocoPipe } from '@jsverse/transloco';
import { TabComponent, TabDirective, TabPaneComponent } from 'multidirectory-ui-kit';
import { EntityAttributesComponent } from '../../entity-attributes/entity-attributes.component';
import { MemberOfComponent } from '../member-of/member-of.component';
import { ContactPropertiesAddressComponent } from './address/contact-properties-address.component';
import { ContactPropertiesGeneralComponent } from './general/contact-properties-general.component';

@Component({
  selector: 'app-contact-properties',
  styleUrls: ['./contact-properties.component.scss'],
  templateUrl: 'contact-properties.component.html',
  imports: [
    TabPaneComponent,
    TabComponent,
    TranslocoPipe,
    ContactPropertiesGeneralComponent,
    TabDirective,
    EntityAttributesComponent,
    ContactPropertiesAddressComponent,
    MemberOfComponent,
    ContactPropertiesGeneralComponent,
  ],
})
export class ContactPropertiesComponent implements OnInit {
  @ViewChild('cg') generalProperties!: ContactPropertiesGeneralComponent;
  private cdr = inject(ChangeDetectorRef);
  public accessor = input.required<LdapAttributes>();
  properties?: any[];

  ngOnInit() {
    // console.log( this.keys());
  }

  onTabChanged() {
    this.cdr.detectChanges();
  }

  get generalPropertiesValid(): boolean {
    if (!this.generalProperties) {
      return true;
    }
    return this.generalProperties.formValid;
  }
}
