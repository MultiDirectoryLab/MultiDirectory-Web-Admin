import { Component, OnInit } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [TranslocoPipe],
})
export class AboutComponent implements OnInit {
  vendorVersion = '';

  constructor(private api: MultidirectoryApiService) {}

  ngOnInit(): void {
    this.api.search(SearchQueries.RootDse).subscribe((rootDse) => {
      const vendorVersion = rootDse.search_result[0].partial_attributes.find(
        (x) => x.type == 'vendorVersion',
      );
      this.vendorVersion = vendorVersion?.vals?.[0] ?? '';
    });
  }
}
