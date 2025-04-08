import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { EntityAttributesComponent } from '@features/entity-attributes/entity-attributes.component';
import { ComputerPropertiesAccountComponent } from '@features/ldap-properties/computer-properties/account/computer-properties-account.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ModalInjectDirective,
  TabComponent,
  TabDirective,
  TabPaneComponent,
} from 'multidirectory-ui-kit';
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
