import { SyslogEvent } from '@models/api/syslog/syslog-event';

export interface SyslogEventEditDialogData {
  event: SyslogEvent;
}

export type SyslogEventEditReturnData = SyslogEvent | null;
