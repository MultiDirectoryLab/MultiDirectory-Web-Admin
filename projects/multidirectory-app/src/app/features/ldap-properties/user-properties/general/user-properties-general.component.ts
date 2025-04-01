import { Component, inject, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { MdModalModule, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { AvatarUploadComponent } from '../../avatar-upload/avatar-upload.component';
import { FormsModule } from '@angular/forms';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { DialogService } from '../../../../components/modals/services/dialog.service';
import { AttributeListDialogComponent } from '../../../../components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';
import {
  AttributeListDialogData,
  AttributeListDialogReturnData,
} from '../../../../components/modals/interfaces/attribute-list-dialog.interface';

@Component({
  selector: 'app-user-properties-general',
  styleUrls: ['./user-properties-general.component.scss'],
  templateUrl: './user-properties-general.component.html',
  standalone: true,
  imports: [
    AvatarUploadComponent,
    MultidirectoryUiKitModule,
    FormsModule,
    MdModalModule,
    TranslocoPipe,
    RequiredWithMessageDirective,
  ],
})
export class UserPropertiesGeneralComponent {
  @Input() accessor: LdapAttributes | null = null;
  private dialogService: DialogService = inject(DialogService);

  constructor(public toastr: ToastrService) {}

  changeOtherAttributeList(title: string, field: string) {
    if (!this.accessor) {
      return;
    }
    if (!this.accessor[field]) {
      this.accessor[field] = [];
    }

    this.dialogService
      .open<AttributeListDialogReturnData, AttributeListDialogData, AttributeListDialogComponent>({
        component: AttributeListDialogComponent,
        dialogConfig: {
          data: {
            title: translate(title),
            field: field,
            values: this.accessor[field],
          },
        },
      })
      .closed.pipe()
      .subscribe((result: any) => {
        if (!result) {
          return;
        }
        this.accessor![field] = result;
      });
  }
}
