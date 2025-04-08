import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  CheckboxComponent,
  GroupComponent,
  MdFormComponent,
  ModalInjectDirective,
  TextboxComponent,
} from 'multidirectory-ui-kit';

@Component({
  selector: 'app-password-policy-create',
  templateUrl: './password-policy-create.component.html',
  styleUrls: ['./password-policy-create.component.scss'],
  imports: [
    MdFormComponent,
    TextboxComponent,
    FormsModule,
    GroupComponent,
    CheckboxComponent,
    ButtonComponent,
    TranslocoPipe,
    RequiredWithMessageDirective,
  ],
})
export class PasswordPolicyCreateComponent {
  private modalControl = inject(ModalInjectDirective);

  @ViewChild('form') form!: MdFormComponent;
  passwordPolicy = new PasswordPolicy();

  close() {
    this.modalControl.close();
  }

  save() {
    this.form.validate();
  }
}
