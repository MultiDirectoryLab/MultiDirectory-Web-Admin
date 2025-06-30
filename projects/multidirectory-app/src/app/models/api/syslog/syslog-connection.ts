export type SyslogType = 'syslog';
export type SyslogProtocol = 'tcp' | 'udp';

export class SyslogConnection {
  name: string = '';
  type: SyslogType = 'syslog';
  host: string = '';
  port: number = 443;
  protocol = 'tcp';
  constructor(obj: Partial<SyslogConnection>) {
    Object.assign(this, obj);
  }
}
