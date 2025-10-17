import { Component, inject, OnChanges, OnInit } from '@angular/core';
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
import { JsonPipe } from '@angular/common';
import { IReservation, TReservationList } from '@models/api/dhcp/dhcp-reservations.model';

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
export class DhcpAddReservationComponent {
  dhcpForm: FormGroup;
  submitted = false;
  private dialogService = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private readonly dhcp = inject(DhcpApiService);
  private currentReservationExist: boolean = false;
  protected dialogData: Subnet = inject(DIALOG_DATA);

  constructor(private fb: FormBuilder) {
    this.dhcpForm = this.fb.group({
      nameOfReservation: ['', [Validators.required]],
      ipAddress: ['', [Validators.required]],
      macAddress: ['', [Validators.required]],
      // desc: ['', [Validators.requsired]],
    });
  }
  get form() {
    return this.dhcpForm?.controls;
  }

  // Обработка отправки формы
  onSubmit(event: Event): void {
    // Проверка валидности формы
    console.log(this.dialogData);
    if (this.dhcpForm?.invalid) {
      alert('invalid');
      return;
    }
    // @ts-ignore
    let data: DhcpCreateSubnetRequest = {
      subnet_id: this.dialogData.id,
      ip_address: this.form.ipAddress.value,
      mac_address: this.form.macAddress.value,
      hostname: this.form.nameOfReservation.value,
    };

    this.dhcp
      .createDhcpReservations(data)
      .pipe(
        catchError((err) => {
          throw err;
        }),
      )
      .subscribe(() => {
        this.dhcp.getReservationsList(this.dialogData.id);
        this.dialogService.close(this.dialogRef);
      });
  }

  protected readonly event = event;
}
