import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { DialogComponent } from '@components/modals/components/core/dialog/dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { DropdownOption, MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { SyslogConnectionEditDialogData } from './syslog-connection-edit.interface';
import { FormsModule, RequiredValidator } from '@angular/forms';
import { DialogService } from '@components/modals/services/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SyslogConnection } from '@models/api/syslog/syslog-connection';
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';

@Component({
  selector: 'app-syslog-connection-editor',
  templateUrl: './syslog-connection-edit.component.html',
  styleUrls: ['./syslog-connection-edit.component.scss'],
  imports: [
    DialogComponent,
    MultidirectoryUiKitModule,
    CommonModule,
    TranslocoModule,
    FormsModule,
    RequiredWithMessageDirective,
  ],
})
export class SyslogConnectionEditComponent implements OnInit {
  private data = inject<SyslogConnectionEditDialogData>(DIALOG_DATA);
  private dialog = inject(DialogService);
  private dialogRef = inject(DialogRef);
  private form = viewChild.required<MdFormComponent>('form');
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  connection: SyslogConnection = new SyslogConnection({});

  serverTypes = [new DropdownOption({ value: 'syslog', title: 'Syslog' })];

  protocols = [
    new DropdownOption({ value: 'tcp', title: 'TCP' }),
    new DropdownOption({ value: 'udp', title: 'UDP' }),
  ];

  ngOnInit(): void {
    this.connection = this.data.connection;
  }

  close() {
    this.dialog.close(this.dialogRef, null);
  }
  finish() {
    this.dialog.close(this.dialogRef, this.connection);
  }
}
