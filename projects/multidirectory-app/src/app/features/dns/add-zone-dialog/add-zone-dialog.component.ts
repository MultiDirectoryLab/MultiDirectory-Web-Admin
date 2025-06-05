import { Component } from '@angular/core';
import { DialogComponent } from '../../../components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MuiButtonComponent, MuiInputComponent } from '@mflab/mui-kit';

@Component({
  selector: 'app-add-zone-dialog',
  templateUrl: './add-zone-dialog.component.html',
  styleUrls: ['./add-zone-dialog.component.scss'],
  imports: [DialogComponent, TranslocoModule, MuiInputComponent, MuiButtonComponent],
})
export class AddZoneDialogComponent {}
