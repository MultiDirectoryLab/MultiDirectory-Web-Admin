import { NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, input } from '@angular/core';
import { SearchResult } from '@features/search/models/search-result';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { DatagridComponent, DropdownOption } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  imports: [NgStyle, DatagridComponent, TranslocoPipe],
})
export class SearchResultComponent {
  private cdr = inject(ChangeDetectorRef);
  private navigation = inject(AppNavigationService);
  columns = [{ name: translate('search-result.name'), prop: 'name', flexGrow: 1 }];
  readonly rows = input<SearchResult[]>([]);

  offset = 0;
  total = computed(() => {
    return this.rows().length;
  });
  pageSizes: DropdownOption[] = [
    { title: '15', value: 15 },
    { title: '20', value: 20 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
  ];
  limit = this.pageSizes[0].value;

  goTo(event: any) {
    if (event?.row?.name) {
      this.navigation.navigate(['ldap'], { distinguishedName: event.row.name, select: 1 });
    }
    this.cdr.detectChanges();
  }
}
