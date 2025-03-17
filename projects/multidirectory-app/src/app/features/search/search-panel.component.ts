import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SearchResult } from '@features/search/models/search-result';
import { SearchType } from '@features/search/models/search-type';
import { translate } from '@jsverse/transloco';
import { SpinnerComponent } from 'multidirectory-ui-kit';
import { map } from 'rxjs';
import { SearchSource } from './models/search-source';
import { SearchResultComponent } from './search-forms/search-result/search-result.component';
import { SearchUsersComponent } from './search-forms/search-users/search-users.component';
import { SearchSourceProvider } from './services/search-source-provider';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent implements AfterViewInit {
  SearchType = SearchType;
  searchType = SearchType.Ldap;
  searchTypes = [{ title: translate('search-panel.user-search-type'), value: SearchType.Ldap }];

  selectedSearchSource?: string;
  searchSources: string[] = [];
  searchResults: SearchResult[] = [];

  @ViewChild('searchUserForm') searchUserForm!: SearchUsersComponent;
  @ViewChild('searchResultForm') searchResultForm!: SearchResultComponent;
  @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;

  constructor(
    private searchSourceProvider: SearchSourceProvider,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const mapToDropdown = (x: SearchSource[]) => x.map((y) => y.title);
    this.searchSourceProvider
      .getSearchSources(SearchType.Ldap)
      .pipe(map(mapToDropdown))
      .subscribe((x) => {
        this.searchSources = x;
        this.selectedSearchSource = x[0];
        this.cdr.detectChanges();
      });
  }

  search() {
    const query = this.searchUserForm.searchQuery.trim();
    if (!query || query.length < 2) {
      return;
    }
    const source = this.searchSources.find((x) => x == this.selectedSearchSource);
    if (!source) {
      return;
    }
    this.spinner.show();
  }

  clear() {
    this.searchResults = [];
  }
}
