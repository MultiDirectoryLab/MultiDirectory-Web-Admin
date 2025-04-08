import { NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { SearchResult } from '@features/search/models/search-result';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { AppNavigationService } from '@services/app-navigation.service';
import { DatagridComponent } from 'multidirectory-ui-kit';

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
  @Input() rows: SearchResult[] = [];

  goTo(event: any) {
    if (event?.row?.name) {
      this.navigation.goTo(event.row.name).then((node) => {
        if (!node) {
          return;
        }
        this.navigation.navigate(node);
        this.cdr.detectChanges();
      });
    }
    this.cdr.detectChanges();
  }
}
