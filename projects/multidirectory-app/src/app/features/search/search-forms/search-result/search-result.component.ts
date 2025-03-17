import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { SearchResult } from '@features/search/models/search-result';
import { AppNavigationService } from '@services/app-navigation.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {
  columns = [{ name: translate('search-result.name'), prop: 'name', flexGrow: 1 }];
  @Input() rows: SearchResult[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private navigation: AppNavigationService,
  ) {}

  goTo(event: any) {
    if (event?.row?.name) {
    }
    this.cdr.detectChanges();
  }
}
