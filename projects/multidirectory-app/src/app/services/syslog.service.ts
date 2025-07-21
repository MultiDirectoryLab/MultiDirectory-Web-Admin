import { inject, Injectable } from '@angular/core';
import { MultidirectoryApiService } from './multidirectory-api.service';
import { SyslogEvent } from '@models/api/syslog/syslog-event';
import { Observable, of } from 'rxjs';
import { SyslogConnection } from '@models/api/syslog/syslog-connection';

@Injectable({ providedIn: 'root' })
export class SyslogService {
  private api = inject(MultidirectoryApiService);

  getEvents(): Observable<SyslogEvent[]> {
    return this.api.getAuditPolicies();
  }

  getConnections(): Observable<SyslogConnection[]> {
    return of([]);
  }
}
