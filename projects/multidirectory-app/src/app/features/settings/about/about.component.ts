import { Component, OnInit, inject } from '@angular/core';
import { SearchQueries } from '@core/ldap/search';
import { TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [TranslocoPipe],
})
export class AboutComponent implements OnInit {
  private api = inject(MultidirectoryApiService);

  vendorVersion = '';

  ngOnInit(): void {
    this.api.search(SearchQueries.RootDse).subscribe((rootDse) => {
      const vendorVersion = rootDse.search_result[0].partial_attributes.find(
        (x) => x.type == 'vendorVersion',
      );
      this.vendorVersion = vendorVersion?.vals?.[0] ?? '';
    });
  }
}
