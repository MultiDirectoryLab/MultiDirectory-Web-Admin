import { Injectable, inject } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsRuleType } from '@models/api/dns/dns-rule-type';
import { DnsServiceResponse } from '@models/api/dns/dns-service-response';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsAddZoneRequest } from '@models/dns/zones/dns-add-zone-response';
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
      .post<string>('dns/record', rule)
      .execute()
      .pipe(map(() => rule));
  }

  update(rule: DnsRule): Observable<DnsRule> {
    return this.httpClient
      .patch<string>('dns/record', rule)
      .execute()
      .pipe(map(() => rule));
  }

  delete(rule: DnsRule): Observable<string> {
    return this.httpClient.delete<string>('dns/record', rule).execute();
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

  zone(request: string): Observable<DnsZoneListResponse[]> {
    return this.dnsHttpClient
      .get<DnsZoneListResponse[]>(`dns/zone`)
      .execute()
      .pipe(
        tap((x) => {
          for (let zone of x) {
            for (let record_type of zone.records) {
              for (let record of record_type.records) {
                record.record_type = record_type.record_type as DnsRuleType;
              }
            }
          }
        }),
      );
  }

  addZone(request: DnsAddZoneRequest): Observable<string> {
    return this.dnsHttpClient.post<string>('dns/zone', request).execute();
  }

  deleteZone(zoneNames: string[]) {
    return this.dnsHttpClient.delete<string>('dns/zone', { zone_names: zoneNames }).execute();
  }
}
