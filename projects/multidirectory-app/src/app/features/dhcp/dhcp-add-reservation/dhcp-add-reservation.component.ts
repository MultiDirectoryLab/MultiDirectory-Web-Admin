import { Component, OnChanges, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonComponent, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { IpAddressValidatorDirective } from '@core/validators/ip-address.directive';

@Component({
  selector: 'app-dhcp-add-reservation',
  templateUrl: './dhcp-add-reservation.component.html',
  styleUrls: ['./dhcp-add-reservation.component.scss'],
  imports: [
    TranslocoModule,
    TextboxComponent,
    MdFormComponent,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    IpAddressValidatorDirective,
  ],
})
export class DhcpAddReservationComponent implements OnInit, OnChanges {
  dhcpForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.dhcpForm = this.fb.group({
      nameOfReservation: ['', [Validators.required]],
      ipAddress: ['', [Validators.required]],
      macAddress: ['', [Validators.required]],
      desc: ['', [Validators.required]],
    });
  }

  get f() {
    return this.dhcpForm.controls;
  }

  ngOnChanges(): void {
    console.log('Form Errors:', this.dhcpForm.controls);
  }
  ngOnInit(): void {
    console.log('ngOnInit');
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
