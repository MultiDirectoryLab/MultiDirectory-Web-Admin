import { Component, OnChanges, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ButtonComponent,
  MdFormComponent,
  NumberComponent,
  RadiobuttonComponent,
  RadioGroupComponent,
  TextboxComponent,
} from 'multidirectory-ui-kit';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { IpAddressValidatorDirective } from '@core/validators/ip-address.directive';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dhcp-setup-wizard',
  templateUrl: './dhcp-setup-wizard.component.html',
  styleUrls: ['./dhcp-setup-wizard.component.scss'],
  imports: [
    TranslocoModule,
    TextboxComponent,
    MdFormComponent,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    RadiobuttonComponent,
    RadioGroupComponent,
    ButtonComponent,
    NumberComponent,
    IpAddressValidatorDirective,
  ],
})
export class DHCPSetupWizardComponent implements OnInit, OnChanges {
  dhcpForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    // Инициализация формы с помощью FormBuilder
    this.dhcpForm = this.fb.group({
      interface: ['', [Validators.required]],
      startIp: ['', [Validators.required]],
      endIp: ['', [Validators.required]],
      days: ['', [Validators.required]],
      hours: ['', [Validators.required, Validators.max(24)]],
      minutes: ['', [Validators.required, Validators.max(60)]],
    });
  }

  // days: ['', [Validators.required, Validators.max(999), Validators.maxLength(3)]],
  // hours: ['', [Validators.required, Validators.max(24), Validators.maxLength(2)]],
  // minutes: ['', [Validators.required, Validators.max(60), Validators.maxLength(2)]],
  // Геттер для удобного доступа к полям формы
  get f() {
    return this.dhcpForm.controls;
  }

  ngOnChanges(): void {
    console.log('Form Errors:', this.dhcpForm.controls);
  }
  ngOnInit(): void {}
  interfaceSet($event: Event | undefined) {
    console.log($event);
  }

  // Обработка отправки формы
  onSubmit(event: Event): void {
    this.submitted = true;

    // Вывод данных формы в консоль
    console.log('Form Submitted!', this.dhcpForm);
    // Проверка валидности формы
    if (this.dhcpForm.invalid) {
      alert('invalid');
      return;
    }

    // Вывод данных формы в консоль
    console.log('Form Submitted!', this.dhcpForm.value);
  }

  protected readonly event = event;
}
