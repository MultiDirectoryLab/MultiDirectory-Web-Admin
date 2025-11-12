import { inject, Injectable } from '@angular/core';
import { ApiAdapter } from '@core/api/api-adapter';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { DhcpStatusResponse } from '@models/api/dhcp/dhcp-status-response';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DnsAdapterSettings } from '@core/api/dns-adapter.settings';
import { DhcpSetupRequest } from '@models/api/dhcp/dhcp-setup-request';
import { Subnet, TSubnetsList } from '@models/api/dhcp/dhcp-subnet.model';
import {
  DhcpCreateSubnetRequest,
  DhcpUpdateSubnetRequest,
} from '@models/api/dhcp/dhcp-create-subnet-response';
import { TReservationList, TReservationListStore } from '@models/api/dhcp/dhcp-reservations.model';
import {
  DhcpCreateReservationRequest,
  DhcpDeleteReservationRequest, DhcpLeaseToReservationResponse,
} from '@models/api/dhcp/dhcp-create-reservation-response';
import { DhcpCreateLeaseRequest } from '@models/api/dhcp/dhcp-create-lease-response';
import { TLeasesList, TLeasesListStore } from '@models/api/dhcp/dhcp-lease.model';
import { TRentedList } from '@models/api/dhcp/dhcp-rented.model';

@Injectable({
  providedIn: 'root',
})
export class DhcpApiService {
  private httpClient = inject<ApiAdapter<MultidirectoryAdapterSettings>>('apiAdapter' as any);
  private DhcpHttpClient = inject<ApiAdapter<DnsAdapterSettings>>('dnsAdapter' as any);

  readonly dhcpStatusRx: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get $dhcpStatus(): Observable<boolean> {
    return this.dhcpStatusRx.asObservable();
  }

  set dhcpStatus(data: boolean) {
    this.dhcpStatusRx.next(data);
  }

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
  readonly leaseListRx: BehaviorSubject<TLeasesListStore> = new BehaviorSubject({
    list: {},
  });
  get $leaseList(): Observable<TLeasesListStore> {
    return this.leaseListRx.asObservable();
  }

  set leaseList(data: TLeasesListStore) {
    this.leaseListRx.next(data);
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
    return this.DhcpHttpClient.get<DhcpStatusResponse>('dhcp/status').execute();
  }

  getRentedList(subnetId: string) {
    this.getDhcpRented(subnetId).subscribe((data: TRentedList) => {
      this.reservationsList = {
        list: {
          ...this.reservationsList?.['list'],
          [subnetId]: data,
        },
      };
    });
  }

  getDhcpRented(subnet_id: string): Observable<TLeasesList> {
    return this.httpClient.get<TLeasesList>(`dhcp/lease/${subnet_id}`).execute();
  }

  leaseToReservation(request: DhcpCreateReservationRequest[]): Observable<DhcpLeaseToReservationResponse> {
    return this.httpClient.patch<DhcpLeaseToReservationResponse>(`dhcp/lease/to_reservation`, request).execute();
  }

  setup(request: DhcpSetupRequest): Observable<boolean> {
    return this.DhcpHttpClient.post<boolean>('dhcp/service/change_state', request)
      .execute()
      .pipe(tap(() => this.getDhcpStatus()));
  }

  getDhcpStatus() {
    this.httpClient
      .get<DhcpStatusResponse>('dhcp/service/state')
      .execute()
      .subscribe(
        (status: DhcpStatusResponse) => (this.dhcpStatus = status.dhcp_manager_state === '1'),
      );
  }

  createDhcpLease(request: DhcpCreateLeaseRequest): Observable<DhcpCreateLeaseRequest> {
    return this.httpClient.post<DhcpCreateLeaseRequest>(`dhcp/lease`, request).execute();
  }
  getDhcpLeases(subnetId: string): Observable<TLeasesList> {
    return this.httpClient.get<TLeasesList>(`dhcp/lease/${subnetId}`).execute();
  }

  getLeasesList(subnetId: string) {
    this.getDhcpLeases(subnetId).subscribe((data: TLeasesList) => {
      this.leaseList = {
        list: {
          ...this.leaseList?.['list'],
          [subnetId]: data,
        },
      };
    });
  }
}
