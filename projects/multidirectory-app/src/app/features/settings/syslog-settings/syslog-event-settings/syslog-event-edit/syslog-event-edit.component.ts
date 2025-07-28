import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { DropdownOption, MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { FormsModule, RequiredValidator } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { SyslogEventEditDialogData } from './syslog-event-edit.interface';
import { SyslogEvent } from '@models/api/syslog/syslog-event';

@Component({
  selector: 'app-syslog-event-editor',
  templateUrl: './syslog-event-edit.component.html',
  styleUrls: ['./syslog-event-edit.component.scss'],
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    CommonModule,
    TranslocoModule,
    FormsModule,
    RequiredWithMessageDirective,
  ],
})
export class SyslogEventEditComponent implements OnInit {
  private data = inject<SyslogEventEditDialogData>(DIALOG_DATA);
  private dialog = inject(DialogService);
  private dialogRef = inject(DialogRef);
  event: SyslogEvent = new SyslogEvent({});

  levelOptions = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'];

  ngOnInit(): void {
    this.event = this.data.event;
  }

  close() {
    this.dialog.close(this.dialogRef, null);
  }
  finish() {
    this.dialog.close(this.dialogRef, this.event);
  }
}
