import { Component, inject, OnInit } from '@angular/core';
import { MuiButtonComponent } from '@mflab/mui-kit';
import { DnsZoneListResponse } from '@models/dns/zones/dns-zone-response';
import { DnsApiService } from '@services/dns-api.service';
import { DnsZoneListItemComponent } from '../dns-zone-list-item/dns-zone-list-item.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-dns-zones',
  templateUrl: './dns-zones.component.html',
  styleUrls: ['./dns-zones.component.scss'],
  imports: [MuiButtonComponent, TranslocoModule, DnsZoneListItemComponent],
})
export default class DnsZonesComponent implements OnInit {
  private dns = inject(DnsApiService);
  zones: DnsZoneListResponse[] = [];

  listDnsZones(name: string = '') {}

  ngOnInit(): void {
    const name = '';
    this.dns.zone(name).subscribe((x) => {
      console.log(x);
      this.zones = x;
    });
  }

  onAddDnsZone() {
    alert('test');
  }
}
