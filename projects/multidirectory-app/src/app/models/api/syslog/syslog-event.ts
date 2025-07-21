export type SyslogLevel = 'info' | 'warning' | 'error' | 'verbose' | 'debug';

export class SyslogEvent {
  id: string = '';
  name: string = '';
  description = '';
  level: SyslogLevel = 'info';
  is_enabled = false;

  constructor(obj: Partial<SyslogEvent>) {
    Object.assign(this, obj);
  }
}
