import { Component, inject, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { AvatarUploadComponent } from '@features/ldap-properties/avatar-upload/avatar-upload.component';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, TextboxComponent, MdFormComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { AttributeListDialogComponent } from '../../../../components/modals/components/dialogs/attribute-list-dialog/attribute-list-dialog.component';
import {
  AttributeListDialogData,
  AttributeListDialogReturnData,
} from '../../../../components/modals/interfaces/attribute-list-dialog.interface';
import { DialogService } from '../../../../components/modals/services/dialog.service';
import { ValidationFunctions } from '@core/validators/validator-functions';
import { DomainFormatValidatorDirective } from '@core/validators/domainformat.directive';
import { MaxLengthValidatorDirective } from '@core/validators/max-length.directive';

@Component({
  selector: 'app-user-properties-general',
  styleUrls: ['./user-properties-general.component.scss'],
  templateUrl: './user-properties-general.component.html',
  imports: [
    AvatarUploadComponent,
    TextboxComponent,
    MdFormComponent,
    FormsModule,
    RequiredWithMessageDirective,
    TranslocoPipe,
    ButtonComponent,
    DomainFormatValidatorDirective,
    MaxLengthValidatorDirective,
  ],
})
export class UserPropertiesGeneralComponent implements AfterViewInit {
  private dialogService: DialogService = inject(DialogService);
  @Input() accessor: LdapAttributes | null = null;
  @ViewChild('form') userPropsForm!: MdFormComponent;
  toastr = inject(ToastrService);

  ngAfterViewInit() {
    this.userPropsForm?.validate();
  }

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
                ? ValidationFunctions.shouldBeWebpage()
                : ValidationFunctions.shouldBePhone(),
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

  get formValid(): boolean {
    if (!this.userPropsForm) {
      return true;
    }
    return this.userPropsForm.valid;
  }
}
