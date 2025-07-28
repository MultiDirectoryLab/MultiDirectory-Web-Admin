import { SyslogConnection } from '@models/api/syslog/syslog-connection';

export interface SyslogConnectionEditDialogData {
  connection: SyslogConnection;
}

export type SyslogConnectionEditReturnData = SyslogConnection | null;
