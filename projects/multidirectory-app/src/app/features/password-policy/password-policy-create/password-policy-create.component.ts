import { Component, ViewChild } from '@angular/core';
import { PasswordPolicy } from '@core/password-policy/password-policy';
import { MdFormComponent, ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-password-policy-create',
  templateUrl: './password-policy-create.component.html',
  styleUrls: ['./password-policy-create.component.scss'],
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
