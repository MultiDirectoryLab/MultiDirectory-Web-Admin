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

  updateEvent(event: SyslogEvent) {
    return this.api.updateAuditEvent(event);
  }

  getConnections(): Observable<SyslogConnection[]> {
    return this.api.getAuditDestinations();
  }
  updateConnection(connection: SyslogConnection): Observable<string> {
    return this.api.updateAuditDestination(connection);
  }
  createConnections(connection: SyslogConnection): Observable<string> {
    return this.api.createAuditDestination(connection);
  }
  deleteConnection(connectionId: number): Observable<string> {
    return this.api.deleteAuditDestination(connectionId);
  }
}
