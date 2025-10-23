import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ButtonComponent,
  MdFormComponent,
  NumberComponent,
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
import { DhcpApiService } from '@services/dhcp-api.service';
import { DhcpCreateSubnetRequest } from '@models/api/dhcp/dhcp-create-subnet-response';
import { DialogService } from '@components/modals/services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';
import { catchError } from 'rxjs';
import { DAY, HOUR, MINUTE } from '@models/time-constants.constants';

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
    ButtonComponent,
    NumberComponent,
    ButtonComponent,
  ],
})
export class DHCPSetupWizardComponent {
  dhcpForm: FormGroup = this.fb.group({});
  ipReg = '(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)';
  subnetMaskReg = `${this.ipReg}\\/(?:3[0-2]|[12]?\\d|0)`;
  private readonly dhcp = inject(DhcpApiService);
  private dialogService = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private dialogData: Subnet = inject(DIALOG_DATA);
  private isResetForm = Object.keys(this.dialogData).length > 0;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  // Геттер для удобного доступа к полям формы
  get form() {
    return this.dhcpForm?.controls;
  }

  // Обработка отправки формы
  onSubmit(event: Event): void {
    // Проверка валидности формы
    if (this.dhcpForm?.invalid) {
      alert('invalid');
      return;
    }
    const lifetime = this.calcDateToNumber();
    // @ts-ignore
    let data: DhcpCreateSubnetRequest = {
      subnet: this.form.subnetMask.value,
      pool: `${this.form.startIp.value}-${this.form.endIp.value}`,
      valid_lifetime: lifetime,
      default_gateway: this.form.defaultGateway.value,
    };

    if (!this.isResetForm) {
      this.dhcp
        .createDhcpSubnet(data)
        .pipe(
          catchError((err) => {
            throw err;
          }),
        )
        .subscribe(() => {
          this.dhcp.getAreasList();
          this.dialogService.close(this.dialogRef);
        });
    } else {
      this.dhcp
        .updateDhcpSubnet(data, this.dialogData.id)
        .pipe(
          catchError((err) => {
            throw err;
          }),
        )
        .subscribe(() => {
          this.dhcp.getAreasList();
          this.dialogService.close(this.dialogRef);
        });
    }
  }
  calcDateToNumber(): number {
    return (
      this.form.days.value * DAY + this.form.hours.value * HOUR + this.form.minutes.value * MINUTE
    );
  }
  calcNumberToDate(ms: number) {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return { days, hours, minutes };
  }

  onCancel(event: MouseEvent) {
    this.dialogService.close(this.dialogRef);
  }

  initForm() {
    // Инициализация формы с помощью FormBuilder

    const date = this.calcNumberToDate(this.dialogData.valid_lifetime);
    this.dhcpForm = this.fb.group({
      startIp: [
        this.isResetForm ? this.dialogData?.pool[0].split('-')[0] : '',
        [Validators.required, Validators.pattern(this.ipReg)],
      ],
      endIp: [
        this.isResetForm ? this.dialogData?.pool[0].split('-')[1] : '',
        [Validators.required, Validators.pattern(this.ipReg)],
      ],
      days: [this.isResetForm ? date.days : '', [Validators.required, Validators.max(999)]],
      hours: [this.isResetForm ? date.hours : '', [Validators.required, Validators.max(24)]],
      minutes: [this.isResetForm ? date.minutes : '', [Validators.required, Validators.max(60)]],
      subnetMask: [this.isResetForm ? this.dialogData?.subnet : '', []],
      defaultGateway: [
        this.isResetForm ? this.dialogData?.default_gateway : '',
        [Validators.required, Validators.pattern(this.ipReg)],
      ],
    });
  }
}
