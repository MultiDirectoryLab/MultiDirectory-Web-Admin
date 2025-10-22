import { Component, inject } from '@angular/core';
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
import { Subnet } from '@models/api/dhcp/dhcp-subnet.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DhcpApiService } from '@services/dhcp-api.service';
import { catchError } from 'rxjs';
import { DialogService } from '@components/modals/services/dialog.service';

@Component({
  selector: 'app-dhcp-add-lease',
  templateUrl: './dhcp-add-lease.component.html',
  styleUrls: ['./dhcp-add-lease.component.scss'],
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
export class DhcpAddLeaseComponent {
  addLeaseDhcpForm: FormGroup;
  submitted = false;
  private dialogService = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private readonly dhcp = inject(DhcpApiService);
  protected dialogData: Subnet = inject(DIALOG_DATA);

  constructor(private fb: FormBuilder) {
    this.addLeaseDhcpForm = this.fb.group({
      nameOfReservation: ['', [Validators.required]],
      ipAddress: ['', [Validators.required]],
      macAddress: ['', [Validators.required]],
      validLifetime: ['', [Validators.required]],
    });
  }
  get form() {
    return this.addLeaseDhcpForm?.controls;
  }

  // Обработка отправки формы
  onSubmit(event: Event): void {
    // Проверка валидности формы
    if (this.addLeaseDhcpForm?.invalid) {
      alert('invalid');
      return;
    }
    // @ts-ignore
    let data: DhcpCreateLeaseRequest = {
      subnet_id: this.dialogData.id,
      ip_address: this.form.ipAddress.value,
      mac_address: this.form.macAddress.value,
      hostname: this.form.nameOfReservation.value,
      validLifetime: this.form.validLifetime.value,
    };

    this.dhcp
      .createDhcpLease(data)
      .pipe(
        catchError((err) => {
          throw err;
        }),
      )
      .subscribe(() => {
        this.dhcp.getLeasesList(this.dialogData.id);
        this.dialogService.close(this.dialogRef);
      });
  }

  protected readonly event = event;
}
