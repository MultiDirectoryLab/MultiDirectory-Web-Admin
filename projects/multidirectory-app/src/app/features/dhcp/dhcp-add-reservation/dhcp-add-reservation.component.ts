import { Component, inject } from '@angular/core';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { ButtonComponent, MdFormComponent, TextboxComponent } from 'multidirectory-ui-kit';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DhcpApiService } from '@services/dhcp-api.service';
import { catchError, EMPTY } from 'rxjs';
import { DialogService } from '@components/modals/services/dialog.service';
import { ReservationDataWrapper } from '@models/api/dhcp/dhcp-reservations.model';
import { ToastrService } from 'ngx-toastr';
import { DhcpReservationRequest } from '@models/api/dhcp/dhcp-create-reservation-response';
import { HttpErrorResponse } from '@angular/common/http';

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
  ],
})
export class DhcpAddReservationComponent {
  dhcpForm: FormGroup;
  private dialogService = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private readonly dhcp = inject(DhcpApiService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  protected dialogData: ReservationDataWrapper = <ReservationDataWrapper>inject(DIALOG_DATA);

  constructor() {
    this.dhcpForm = this.fb.group({
      nameOfReservation: [this.dialogData.reservation.hostname, [Validators.required]],
      ipAddress: [this.dialogData.reservation.ip_address, [Validators.required]],
      macAddress: [this.dialogData.reservation.mac_address, [Validators.required]]
    });
  }

  get form() {
    return this.dhcpForm?.controls;
  }

  // Обработка отправки формы
  onSubmit(): void {
    // Проверка валидности формы
    if (this.dhcpForm?.invalid) {
      this.toastr.error(translate('please-check-errors'));
      return;
    }

    const request = new DhcpReservationRequest({
      subnet_id: this.dialogData.reservation.subnet_id,
      ip_address: this.form.ipAddress.value,
      mac_address: this.form.macAddress.value,
      hostname: this.form.nameOfReservation.value,
    });

    const apiCall = this.dialogData.exists ?
      this.dhcp.modifyDhcpReservation(request) : this.dhcp.createDhcpReservations(request);

    apiCall
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toastr.error(err.error?.detail || err.message);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.dhcp.getReservationsList(this.dialogData.reservation.subnet_id);
        this.dialogService.close(this.dialogRef);
      });
  }
}
