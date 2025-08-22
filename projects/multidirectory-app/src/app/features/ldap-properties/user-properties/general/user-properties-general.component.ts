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
  ],
})
export class UserPropertiesGeneralComponent {
  private dialogService: DialogService = inject(DialogService);
  @Input() accessor: LdapAttributes | null = null;
  toastr = inject(ToastrService);

  shouldBePhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const phoneRegex = /^\+?[0-9]{7,15}$/;
      return phoneRegex.test(control.value) ? null : { shouldBePhone: true };
    };
  }

  shouldBeWebpage(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      try {
        new URL(control.value);
        return null;
      } catch {
        return { shouldBeWebpage: true };
      }
    };
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
            valueValidator: field == 'otherWebpage' ? this.shouldBeWebpage() : this.shouldBePhone(),
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
