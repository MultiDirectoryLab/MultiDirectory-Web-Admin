import { inject, Injectable } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DnsCheckForwardZoneRequest, DnsCheckForwardZoneResponse, DnsServerOption } from '@models/api/dns/dns-check-forward-zone';
import { DnsForwardZone } from '@models/api/dns/dns-forward-zone';
import { DnsRule } from '@models/api/dns/dns-rule';
import { DnsRuleType } from '@models/api/dns/dns-rule-type';
import { DnsServiceResponse } from '@models/api/dns/dns-service-response';
import { DnsSetupRequest } from '@models/api/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/api/dns/dns-status-response';
import { DnsAddZoneRequest } from '@models/dhcp/areas/dhcp-add-areas-response';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { BehaviorSubject, concatMap, exhaustMap, map, merge, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DnsApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);
  private dnsHttpClient = inject<ApiAdapter<DnsAdapterSettings>>('dnsAdapter' as any);

  get(): Observable<DnsServiceResponse[]> {
    return this.httpClient.get<DnsServiceResponse[]>('dns/record').execute();
  }

  readonly dnsStatusRx: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get $dnsStatus(): Observable<boolean> {
    return this.dnsStatusRx.asObservable();
  }

  set dnsStatus(data: boolean) {
    this.dnsStatusRx.next(data);
  }

  status(): Observable<DnsStatusResponse> {
    return this.dnsHttpClient
      .get<DnsStatusResponse>('dns/status')
      .execute()
      .pipe(tap((status: DnsStatusResponse) => (this.dnsStatus = status.dns_status === '1')));
  }

  setup(request: DnsSetupRequest): Observable<boolean> {
    request = !!request.dns_ip_address ? request : {};
    const newState = !!request.dns_ip_address ? '0' : '1';
    return this.dnsHttpClient
      .post<DnsStatusResponse>('dns/state', { state: newState })
      .execute()
      .pipe(
        concatMap((state) => {
          if (!!request.dns_ip_address) {
            return this.dnsHttpClient.post<boolean>('dns/setup', request).execute();
          }
          return this.dnsHttpClient.post<boolean>('dns/setup').execute();
        }),
        tap(() => this.status()),
      );
  }

  zone(): Observable<DnsZoneListResponse[]> {
    return this.dnsHttpClient
      .get<DnsZoneListResponse[]>(`dns/zone`)
      .execute()
      .pipe(
        tap((x) => {
          for (let zone of x) {
            for (let type of zone.rrsets) {
              type.records = type.records.map((record) => ({
                record_type: type.type as DnsRuleType,
                record_name: zone.name,
                record_value: String(record.content ?? ''),
                ttl: type.ttl,
              }));
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
  deleteZone(zone_ids: string[]) {
    return this.dnsHttpClient.delete<string>('dns/zone', { zone_ids: zone_ids }).execute();
  }

  getZone(zone_id: string): any {
    return this.dnsHttpClient.patch<string>(`dns/record/${zone_id}`).execute();
  }
  addZoneRule(request: DnsRule, zone_id: string): Observable<string> {
    return this.dnsHttpClient.post<string>(`dns/record/${zone_id}`, request).execute();
  }
  updateZoneRule(request: DnsRule, zone_id: string): any {
    return this.dnsHttpClient.patch<string>(`dns/record/${zone_id}`, request).execute();
  }
  deleteZoneRule(request: DnsRule, zone_id: string) {
    return this.dnsHttpClient.delete<string>(`dns/record/${zone_id}`, request).execute();
  }
  getForwardZones(): Observable<DnsForwardZone[]> {
    return this.dnsHttpClient.get<DnsForwardZone[]>('dns/zone/forward').execute();
  }
  addForwardZone(request: DnsForwardZone): Observable<DnsForwardZone> {
    return this.dnsHttpClient.post<DnsForwardZone>('dns/zone/forward', request).execute();
  }
  changeForwardZones(request: DnsForwardZone): Observable<DnsForwardZone> {
    return this.dnsHttpClient.patch<DnsForwardZone>('dns/zone/forward', request).execute();
  }
  deleteForwardZones(zone_ids: string[]): Observable<DnsForwardZone> {
    return this.dnsHttpClient.delete<DnsForwardZone>('dns/zone/forward', { zone_ids: zone_ids }).execute();
  }
  checkForwardZone(request: DnsCheckForwardZoneRequest): Observable<DnsCheckForwardZoneResponse[]> {
    return this.dnsHttpClient.post<DnsCheckForwardZoneResponse[]>('dns/forward_check', request).execute();
  }
  getServerOptions(): Observable<DnsServerOption[]> {
    return this.dnsHttpClient.get<DnsServerOption[]>('dns/server/options').execute();
  }
  setServerOptions(request: DnsServerOption[]): Observable<boolean> {
    return this.dnsHttpClient.patch<boolean>('dns/server/options', request).execute();
  }
}
