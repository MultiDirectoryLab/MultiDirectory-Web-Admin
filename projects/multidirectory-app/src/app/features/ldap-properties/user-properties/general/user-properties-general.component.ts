import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { AttributeListComponent } from '@features/ldap-browser/components/editors/attributes-list/attributes-list.component';
import { AvatarUploadComponent } from '@features/ldap-properties/avatar-upload/avatar-upload.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, ModalInjectDirective, TextboxComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-properties-general',
  styleUrls: ['./user-properties-general.component.scss'],
  templateUrl: './user-properties-general.component.html',
  imports: [
    AvatarUploadComponent,
    TextboxComponent,
    FormsModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    ButtonComponent,
    AttributeListComponent,
    ModalInjectDirective,
  ],
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
