import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '@components/modals/components/dialogs/confirm-dialog/confirm-dialog.component';
import {
  ConfirmDialogReturnData,
  ConfirmDialogData,
} from '@components/modals/interfaces/confirm-dialog.interface';
import { DialogService } from '@components/modals/services/dialog.service';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { ConfirmDialogDescriptor } from '@models/api/confirm-dialog/confirm-dialog-descriptor';
import { SyslogConnection } from '@models/api/syslog/syslog-connection';
import { SyslogService } from '@services/syslog.service';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { take, switchMap, EMPTY, of } from 'rxjs';
import {
  SyslogConnectionEditDialogData,
  SyslogConnectionEditReturnData,
} from './syslog-connection-edit/syslog-connection-edit.interface';
import { SyslogConnectionEditComponent } from './syslog-connection-edit/syslog-connection-edit.component';

@Component({
  selector: 'app-syslog-connections-settings',
  imports: [MultidirectoryUiKitModule, CommonModule, FormsModule, TranslocoModule],
  templateUrl: './syslog-connections-settings.component.html',
  styleUrl: './syslog-connections-settings.component.scss',
})
export class SyslogConnectionsSettingsComponent implements OnInit {
  private syslog = inject(SyslogService);
  private dialog = inject(DialogService);
  connections: SyslogConnection[] = [];

  ngOnInit(): void {
    this.syslog.getConnections().subscribe((connections) => {
      this.connections = connections;
    });
  }

  onDeleteClick(toDeleteIndex: number) {
    const prompt: ConfirmDialogDescriptor = {
      promptHeader: translate('remove-confirmation-dialog.prompt-header'),
      promptText: translate('remove-confirmation-dialog.prompt-text'),
      primaryButtons: [{ id: 'yes', text: translate('remove-confirmation-dialog.yes') }],
      secondaryButtons: [{ id: 'cancel', text: translate('remove-confirmation-dialog.cancel') }],
    };

    this.dialog
      .open<ConfirmDialogReturnData, ConfirmDialogData, ConfirmDialogComponent>({
        component: ConfirmDialogComponent,
        dialogConfig: {
          minHeight: '160px',
          data: prompt,
        },
      })
      .closed.pipe(
        take(1),
        switchMap((x) => {
          if (x === 'cancel' || !x) {
            return EMPTY;
          }
          return this.syslog.deleteConnection(this.connections[toDeleteIndex].id);
        }),
      )
      .subscribe(() => {
        this.connections = this.connections.filter((_, ind) => ind !== toDeleteIndex);
      });
  }
  onEditClick(connection: SyslogConnection) {
    this.dialog
      .open<
        SyslogConnectionEditReturnData,
        SyslogConnectionEditDialogData,
        SyslogConnectionEditComponent
      >({
        component: SyslogConnectionEditComponent,
        dialogConfig: {
          data: {
            connection: new SyslogConnection(connection),
          },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return of(result);
          }
          return this.syslog.updateConnection(result);
        }),
      )
      .subscribe((result) => {
        this.syslog.getConnections().subscribe((connections) => {
          this.connections = connections;
        });
      });
  }
  onAddClick() {
    this.dialog
      .open<
        SyslogConnectionEditReturnData,
        SyslogConnectionEditDialogData,
        SyslogConnectionEditComponent
      >({
        component: SyslogConnectionEditComponent,
        dialogConfig: {
          data: {
            connection: new SyslogConnection({}),
          },
        },
      })
      .closed.pipe(
        take(1),
        switchMap((result) => {
          if (!result) {
            return of(result);
          }
          return this.syslog.createConnections(result);
        }),
      )
      .subscribe((result) => {
        this.syslog.getConnections().subscribe((connections) => {
          this.connections = connections;
        });
      });
  }

  onToggleEnabled(connection: SyslogConnection) {
    this.syslog
      .updateConnection(connection)
      .pipe(
        switchMap((result) => {
          return this.syslog.getConnections();
        }),
      )
      .subscribe((connections) => {
        this.connections = connections;
      });
  }
}
