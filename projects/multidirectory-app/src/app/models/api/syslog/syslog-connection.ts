export type SyslogType = 'syslog';
export type SyslogProtocol = 'tcp' | 'udp';

export class SyslogConnection {
  id: number = 0;
  name: string = '';
  service_type: SyslogType = 'syslog';
  host: string = '';
  port: number = 443;
  protocol = 'tcp';
  is_enabled = true;

  constructor(obj: Partial<SyslogConnection>) {
    Object.assign(this, obj);
  }
}
