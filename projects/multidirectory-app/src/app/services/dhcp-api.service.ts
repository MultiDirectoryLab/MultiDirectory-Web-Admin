import { inject, Injectable } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DhcpServiceResponse } from '@models/api/dhcp/dhcp-service-response';
import { DhcpStatusResponse } from '@models/api/dhcp/dhcp-status-response';
import { map, Observable } from 'rxjs';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';

@Injectable({
  providedIn: 'root',
})
export class DhcpApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);
  private DhcpHttpClient = inject<ApiAdapter<DnsAdapterSettings>>('dnsAdapter' as any);

  get(): Observable<DhcpServiceResponse[]> {
    return this.httpClient.get<DhcpServiceResponse[]>('Dhcp/record').execute();
  }

  // post(rule: DhcpRule): Observable<DhcpRule> {
  //   return this.httpClient
  //     .post<string>('Dhcp/record', DhcpRule.toRequest(rule))
  //     .execute()
  //     .pipe(map(() => rule));
  // }
  //
  // update(rule: DhcpRule): Observable<DhcpRule> {
  //   return this.httpClient
  //     .patch<string>('Dhcp/record', DhcpRule.toRequest(rule))
  //     .execute()
  //     .pipe(map(() => rule));
  // }

  // delete(rule: DhcpRule): Observable<string> {
  //   return this.httpClient.delete<string>('Dhcp/record', DhcpRule.toRequest(rule)).execute();
  // }

  status(): Observable<DhcpStatusResponse> {
    return this.DhcpHttpClient.get<DhcpStatusResponse>('Dhcp/status').execute();
  }

  setup(request: DhcpSetupRequest): Observable<boolean> {
    return this.DhcpHttpClient.post<string>('Dhcp/setup', request)
      .execute()
      .pipe(map((x) => !!x));
  }
  //
  // zone(): Observable<DhcpZoneListResponse[]> {
  //   return this.DhcpHttpClient
  //     .get<DhcpZoneListResponse[]>(`Dhcp/zone`)
  //     .execute()
  //     .pipe(
  //       tap((x) => {
  //         for (let zone of x) {
  //           for (let type of zone.records) {
  //             for (let record of type.records) {
  //               record.type = type.type as DhcpRuleType;
  //               record.zone_name = zone.name;
  //             }
  //           }
  //         }
  //       }),
  //     );
  // }
  //
  // addZone(request: DhcpAddZoneRequest): Observable<string> {
  //   return this.DhcpHttpClient.post<string>('Dhcp/zone', request).execute();
  // }
  // updateZone(request: DhcpAddZoneRequest): any {
  //   return this.DhcpHttpClient.patch<string>('Dhcp/zone', request).execute();
  // }
  // deleteZone(zoneNames: string[]) {
  //   return this.DhcpHttpClient.delete<string>('Dhcp/zone', { zone_names: zoneNames }).execute();
  // }
  // getForwardZones(): Observable<DhcpForwardZone[]> {
  //   return this.DhcpHttpClient.get<DhcpForwardZone[]>('Dhcp/zone/forward').execute();
  // }
  // checkForwardZone(request: DhcpCheckForwardZoneRequest): Observable<DhcpCheckForwardZoneResponse[]> {
  //   return this.DhcpHttpClient
  //     .post<DhcpCheckForwardZoneResponse[]>('Dhcp/forward_check', request)
  //     .execute();
  // }
  // getServerOptions(): Observable<DhcpServerOption[]> {
  //   return this.DhcpHttpClient.get<DhcpServerOption[]>('Dhcp/server/options').execute();
  // }
  // setServerOptions(request: DhcpServerOption[]): Observable<boolean> {
  //   return this.DhcpHttpClient.patch<boolean>('Dhcp/server/options', request).execute();
  // }
}
