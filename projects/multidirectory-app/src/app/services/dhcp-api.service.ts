import { inject, Injectable } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DhcpServiceResponse } from '@models/api/dhcp/dhcp-service-response';
import { DhcpStatusResponse } from '@models/api/dhcp/dhcp-status-response';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';
import { TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';
import {
  DhcpCreateSubnetRequest,
  DhcpCreateSubnetResponse,
  DhcpUpdateSubnetRequest,
} from '@models/api/dhcp/dhcp-create-subnet-response';
import { TReservationList, TReservationListStore } from '@models/api/dhcp/dhcp-reservations.model';
import {
  DhcpCreateReservationRequest,
  DhcpDeleteReservationRequest,
} from '@models/api/dhcp/dhcp-create-reservation-response';
import { parameters } from '@storybook/addon-docs/preview';

@Injectable({
  providedIn: 'root',
})
export class DhcpApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);
  private DhcpHttpClient = inject<ApiAdapter<DnsAdapterSettings>>('dnsAdapter' as any);

  readonly areaListRx: BehaviorSubject<TSubnetsList> = new BehaviorSubject([] as TSubnetsList);
  get $areaList(): Observable<TSubnetsList> {
    return this.areaListRx.asObservable();
  }

  set areaList(data: TSubnetsList) {
    this.areaListRx.next(data);
  }
  readonly reservationsListRx: BehaviorSubject<TReservationListStore> = new BehaviorSubject({
    list: {},
  });
  get $reservationsList(): Observable<TReservationListStore> {
    return this.reservationsListRx.asObservable();
  }

  set reservationsList(data: TReservationListStore) {
    this.reservationsListRx.next(data);
  }

  getAreasList() {
    this.getDhcpSubnets().subscribe((data: TSubnetsList) => {
      this.areaList = data;
    });
  }
  getReservationsList(subnetId: string) {
    this.getDhcpReservations(subnetId).subscribe((data: TReservationList) => {
      this.reservationsList = {
        list: {
          ...this.reservationsList?.['list'],
          [subnetId]: data,
        },
      };
    });
  }

  getDhcpSubnets(): Observable<TSubnetsList> {
    return this.httpClient.get<TSubnetsList>('dhcp/subnets').execute();
  }

  createDhcpSubnet(request: DhcpCreateSubnetRequest): Observable<DhcpCreateSubnetRequest> {
    return this.httpClient.post<DhcpCreateSubnetRequest>('dhcp/subnet', request).execute();
  }

  updateDhcpSubnet(
    request: DhcpUpdateSubnetRequest,
    id: string,
  ): Observable<DhcpUpdateSubnetRequest> {
    return this.httpClient.put<DhcpUpdateSubnetRequest>(`dhcp/subnet/${id}`, request).execute();
  }

  deleteDhcpSubnet(id: string): Observable<string> {
    return this.httpClient.delete<string>(`dhcp/subnet/${id}`).execute();
  }

  createDhcpReservations(
    request: DhcpCreateReservationRequest,
  ): Observable<DhcpCreateReservationRequest> {
    return this.httpClient
      .post<DhcpCreateReservationRequest>(`dhcp/reservation`, request)
      .execute();
  }
  deleteDhcpReservation(
    params: DhcpDeleteReservationRequest,
  ): Observable<DhcpDeleteReservationRequest> {
    const url = `dhcp/reservation` + this.calcParameters(params);
    return this.httpClient.delete<DhcpDeleteReservationRequest>(url).execute();
  }
  calcParameters(params: object = {}): string {
    return Object.entries(params).reduce(
      (acc, curr, currentIndex) =>
        currentIndex < 1 ? `?${curr[0]}=${curr[1]}` : `${acc}&${curr[0]}=${curr[1]}`,
      '',
    );
  }

  getDhcpReservations(subnet_id: string): Observable<TReservationList> {
    return this.httpClient.get<TReservationList>(`dhcp/reservation/${subnet_id}`).execute();
  }

  status(): Observable<DhcpStatusResponse> {
    return this.DhcpHttpClient.get<DhcpStatusResponse>('Dhcp/status').execute();
  }
}
