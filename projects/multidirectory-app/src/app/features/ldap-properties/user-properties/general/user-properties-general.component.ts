import { Component, inject, Input } from '@angular/core';
import { AbstractControl, FormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { AvatarUploadComponent } from '@features/ldap-properties/avatar-upload/avatar-upload.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, TextboxComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { AttributeListDialogComponent } from '../../../../components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';
import {
  AttributeListDialogData,
  AttributeListDialogReturnData,
} from '../../../../components/modals/interfaces/attribute-list-dialog.interface';
import { DialogService } from '../../../../components/modals/services/dialog.service';
import { ValidationService } from '@services/validator.service';
import { DomainFormatValidatorDirective } from '@core/validators/domainformat.directive';

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
    DomainFormatValidatorDirective,
  ],
})
export class UserPropertiesGeneralComponent {
  private dialogService: DialogService = inject(DialogService);
  @Input() accessor: LdapAttributes | null = null;
  toastr = inject(ToastrService);
  validation = inject(ValidationService);

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
            valueValidator:
              field == 'otherWebpage'
                ? this.validation.shouldBeWebpage()
                : this.validation.shouldBePhone(),
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
