import { Injectable, inject } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DnsForwardZonesComponent } from '@features/dns/dns-forward-zones/dns-forward-zones.component';
import {
  DnsCheckForwardZoneRequest,
  DnsCheckForwardZoneResponse,
  DnsServerOption,
} from '@models/api/dns/dns-check-forward-zone';
import { DnsForwardZone } from '@models/api/dns/dns-forward-zone';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsRuleType } from '@models/api/dns/dns-rule-type';
import { DnsServiceResponse } from '@models/api/dns/dns-service-response';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsAddZoneRequest } from '@models/dhcp/areas/dhcp-add-areas-response';
import { DnsZoneListResponse, DnsZoneRecordWithType } from '@models/dns/zones/dns-zone-response';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DnsApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);
  private dnsHttpClient = inject<ApiAdapter<DnsAdapterSettings>>('dnsAdapter' as any);

  get(): Observable<DnsServiceResponse[]> {
    return this.httpClient.get<DnsServiceResponse[]>('dns/record').execute();
  }

  post(rule: DnsRule): Observable<DnsRule> {
    return this.httpClient
      .post<string>('dns/record', DnsRule.toRequest(rule))
      .execute()
      .pipe(map(() => rule));
  }

  update(rule: DnsRule): Observable<DnsRule> {
    return this.httpClient
      .patch<string>('dns/record', DnsRule.toRequest(rule))
      .execute()
      .pipe(map(() => rule));
  }

  delete(rule: DnsRule): Observable<string> {
    return this.httpClient.delete<string>('dns/record', DnsRule.toRequest(rule)).execute();
  }

  status(): Observable<DnsStatusResponse> {
    return this.dnsHttpClient.get<DnsStatusResponse>('dns/status').execute();
  }

  setup(request: DnsSetupRequest): Observable<boolean> {
    return this.dnsHttpClient
      .post<string>('dns/setup', request)
      .execute()
      .pipe(map((x) => !!x));
  }

  zone(): Observable<DnsZoneListResponse[]> {
    return this.dnsHttpClient
      .get<DnsZoneListResponse[]>(`dns/zone`)
      .execute()
      .pipe(
        tap((x) => {
          for (let zone of x) {
            for (let type of zone.records) {
              for (let record of type.records) {
                record.type = type.type as DnsRuleType;
                record.zone_name = zone.name;
              }
            }
          }
        }),
      );
  }

  addZone(request: DnsAddZoneRequest): Observable<string> {
    return this.dnsHttpClient.post<string>('dns/zone', request).execute();
  }
  updateZone(request: DnsAddZoneRequest): any {
    return this.dnsHttpClient.patch<string>('dns/zone', request).execute();
  }
  deleteZone(zoneNames: string[]) {
    return this.dnsHttpClient.delete<string>('dns/zone', { zone_names: zoneNames }).execute();
  }
  getForwardZones(): Observable<DnsForwardZone[]> {
    return this.dnsHttpClient.get<DnsForwardZone[]>('dns/zone/forward').execute();
  }
  checkForwardZone(request: DnsCheckForwardZoneRequest): Observable<DnsCheckForwardZoneResponse[]> {
    return this.dnsHttpClient
      .post<DnsCheckForwardZoneResponse[]>('dns/forward_check', request)
      .execute();
  }
  getServerOptions(): Observable<DnsServerOption[]> {
    return this.dnsHttpClient.get<DnsServerOption[]>('dns/server/options').execute();
  }
  setServerOptions(request: DnsServerOption[]): Observable<boolean> {
    return this.dnsHttpClient.patch<boolean>('dns/server/options', request).execute();
  }
}
