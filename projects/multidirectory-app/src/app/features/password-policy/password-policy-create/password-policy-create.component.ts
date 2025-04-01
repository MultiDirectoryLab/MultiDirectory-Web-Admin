import { Component, ViewChild } from '@angular/core';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import {
  MdFormComponent,
  ModalInjectDirective,
  MultidirectoryUiKitModule,
} from 'multidirectory-ui-kit';
import { RequiredWithMessageDirective } from '../../../core/validators/required-with-message.directive';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-password-policy-create',
  templateUrl: './password-policy-create.component.html',
  styleUrls: ['./password-policy-create.component.scss'],
  standalone: true,
  imports: [MultidirectoryUiKitModule, RequiredWithMessageDirective, FormsModule, TranslocoPipe],
})
export class PasswordPolicyCreateComponent {
  @ViewChild('form') form!: MdFormComponent;
  passwordPolicy = new PasswordPolicy();

  constructor(private modalControl: ModalInjectDirective) {}

  close() {
    this.modalControl.close();
  }

  save() {
    this.form.validate();
  }
}
