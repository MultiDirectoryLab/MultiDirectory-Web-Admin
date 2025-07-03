import { Component, inject } from '@angular/core';
import { DialogComponent } from '../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent, MuiInputComponent } from '@mflab/mui-kit';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { DnsApiService } from '@services/dns-api.service';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../components/modals/services/dialog.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-add-zone-dialog',
  templateUrl: './add-zone-dialog.component.html',
  styleUrls: ['./add-zone-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    DialogComponent,
    TranslocoModule,
    MuiInputComponent,
    MultidirectoryUiKitModule,
  ],
})
export class AddZoneDialogComponent {
  private api = inject(DnsApiService);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);

  form = new FormGroup({
    zone_name: new FormControl('md.new.zone'),
    ttl: new FormControl(8600),
    params: new FormControl([]),
  });

  onSumbit(event: SubmitEvent) {
    this.api
      .addZone({
        zone_name: this.form.value.zone_name!,
        params: this.form.value.params!,
        zone_type: 'master',
      })
      .subscribe((result) => {
        this.dialogService.close(this.dialogRef, result);
      });
  }
}
