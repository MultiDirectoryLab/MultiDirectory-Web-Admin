import { Component, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LdapAttributes } from '@core/ldap/ldap-entity-proxy';
import { take } from 'rxjs';
import { translate } from '@ngneat/transloco';
import { AttributeListComponent } from '@features/ldap-browser/components/editors/attributes-list/attributes-list.component';

@Component({
  selector: 'app-user-properties-general',
  styleUrls: ['./user-properties-general.component.scss'],
  templateUrl: './user-properties-general.component.html',
})
export class UserPropertiesGeneralComponent {
  @Input() accessor: LdapAttributes | null = null;
  @ViewChild('attributeList', { static: true }) attributeList: AttributeListComponent | null = null;

  constructor(public toastr: ToastrService) {}

  changeOtherAttributeList(title: string, field: string) {
    if (!this.accessor) {
      return;
    }
    if (!this.accessor[field]) {
      this.accessor[field] = [];
    }
    const closeRx = this.attributeList!.open(translate(title), field, this.accessor[field]);
    closeRx.pipe(take(1)).subscribe((result) => {
      if (!result) {
        return;
      }
      this.accessor![field] = result;
    });
  }
}
