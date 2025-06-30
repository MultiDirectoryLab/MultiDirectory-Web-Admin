import { inject, Injectable } from '@angular/core';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { Observable, of } from 'rxjs';
import { SyslogConnection } from '@models/api/syslog/syslog-connection';

const mockEvents: SyslogEvent[] = [
  new SyslogEvent({
    id: 'evt-001',
    name: 'User Login',
    description: 'Event triggered when a user logs into the system',
    level: 'info',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-002',
    name: 'Failed Authentication',
    description: 'Recorded when a user fails to authenticate',
    level: 'warning',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-003',
    name: 'System Startup',
    description: 'Logged when the system boots up',
    level: 'info',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-004',
    name: 'Database Error',
    description: 'Critical database errors',
    level: 'error',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-005',
    name: 'Disk Space Low',
    description: 'Warning when disk space is running low',
    level: 'warning',
    enabled: false,
  }),
  new SyslogEvent({
    id: 'evt-006',
    name: 'Network Outage',
    description: 'Critical network connectivity issues',
    level: 'info',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-007',
    name: 'API Rate Limit Exceeded',
    description: 'When API call limits are reached',
    level: 'warning',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-008',
    name: 'Backup Completed',
    description: 'Successful system backup completion',
    level: 'info',
    enabled: false,
  }),
  new SyslogEvent({
    id: 'evt-009',
    name: 'Security Breach Attempt',
    description: 'Detected potential security breach',
    level: 'debug',
    enabled: true,
  }),
  new SyslogEvent({
    id: 'evt-010',
    name: 'System Shutdown',
    description: 'Logged when the system is shutting down',
    level: 'info',
    enabled: true,
  }),
];

const mockConnections: SyslogConnection[] = [
  new SyslogConnection({
    name: 'Primary Log Server',
    type: 'syslog',
    host: 'logs-primary.example.com',
    port: 514,
    protocol: 'tcp',
  }),
  new SyslogConnection({
    name: 'Backup Log Aggregator',
    type: 'syslog',
    host: 'backup-logs.company.net',
    port: 6514,
    protocol: 'tls',
  }),
  new SyslogConnection({
    name: 'Internal Dev Server',
    type: 'syslog',
    host: '10.0.1.42',
    port: 514,
    protocol: 'udp',
  }),
];

@Injectable({ providedIn: 'root' })
export class SyslogService {
  private api = inject(MultidirectoryApiService);

  getEvents(): Observable<SyslogEvent[]> {
    return of(mockEvents);
  }

  getConnections(): Observable<SyslogConnection[]> {
    return of(mockConnections);
  }
}
