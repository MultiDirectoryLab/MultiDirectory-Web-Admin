import { Component, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { translate } from '@ngneat/transloco';
import { AttributeListComponent } from '@features/ldap-browser/components/editors/attributes-list/attributes-list.component';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-user-properties-general',
  styleUrls: ['./user-properties-general.component.scss'],
  templateUrl: './user-properties-general.component.html',
})
export class UserPropertiesGeneralComponent {
  @Input() accessor: LdapAttributes | null = null;
  @ViewChild('attributeList', { static: true }) attributeList!: ModalInjectDirective;

  constructor(public toastr: ToastrService) {}

  changeOtherAttributeList(title: string, field: string) {
    if (!this.accessor) {
      return;
    }
    if (!this.accessor[field]) {
      this.accessor[field] = [];
    }

    const closeRx = this.attributeList!.open(
      {},
      {
        title: translate(title),
        field: field,
        values: this.accessor[field],
      },
    );

    closeRx.pipe(take(1)).subscribe((result) => {
      if (!result) {
        return;
      }
      console.log(result);
      this.accessor![field] = result;
    });
  }
}
