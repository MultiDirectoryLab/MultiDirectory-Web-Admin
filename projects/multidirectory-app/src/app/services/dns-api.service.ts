import { Injectable, inject } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DnsRule } from '@models/dns/dns-rule';
import { DnsServiceResponse } from '@models/dns/dns-service-response';
import { DnsSetupRequest } from '@models/dns/dns-setup-request';
import { DnsStatusResponse } from '@models/dns/dns-status-response';
import { DnsZoneListResponse, DnsZoneRecordWithType } from '@models/dns/zones/dns-zone-response';
import { map, Observable, of } from 'rxjs';

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
    // return this.dnsHttpClient
    //   .get<DnsZoneListResponse>(`dns/zone`)
    //   .execute();
    return of([
      new DnsZoneListResponse({
        zone_name: 'multidirectory.beta.io',
        zone_type: 'master',
        records: [
          new DnsZoneRecordWithType({
            record_type: 'master',
            records: [
              new DnsRule({
                record_name: 'master 1',
                record_value: '127.0.0.1',
              }),
              new DnsRule({
                record_name: 'master 2',
                record_value: '127.0.0.2',
              }),
            ],
          }),
          new DnsZoneRecordWithType({
            record_type: 'slave',
            records: [
              new DnsRule({
                record_name: 'master 1',
                record_value: '127.0.0.1',
              }),
              new DnsRule({
                record_name: 'master 2',
                record_value: '127.0.0.2',
              }),
            ],
          }),
        ],
      }),
      new DnsZoneListResponse({
        zone_name: 'mydomain.local',
        zone_type: 'slave',
        records: [
          new DnsZoneRecordWithType({
            record_type: 'slave',
            records: [
              new DnsRule({
                record_name: 'slave 1',
                record_value: '127.0.0.1',
              }),
              new DnsRule({
                record_name: 'slave 2',
                record_value: '127.0.0.2',
              }),
            ],
          }),
          new DnsZoneRecordWithType({
            record_type: 'slave',
            records: [
              new DnsRule({
                record_name: 'slave 1',
                record_value: '127.0.0.1',
              }),
              new DnsRule({
                record_name: 'slave 2',
                record_value: '127.0.0.2',
              }),
            ],
          }),
        ],
      }),
    ]);
  }
}
