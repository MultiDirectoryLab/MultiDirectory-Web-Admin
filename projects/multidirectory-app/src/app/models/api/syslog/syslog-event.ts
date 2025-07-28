import { DropdownOption } from 'multidirectory-ui-kit';

export type SyslogLevel =
  | 'EMERGENCY'
  | 'ALERT'
  | 'CRITICAL'
  | 'ERROR'
  | 'WARNING'
  | 'NOTICE'
  | 'INFO'
  | 'DEBUG';

export class SyslogEvent {
  id: string = '';
  name: string = '';
  severity: string = '';
  is_enabled = false;

  constructor(obj: Partial<SyslogEvent>) {
    Object.assign(this, obj);
  }
}
