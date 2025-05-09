import { AfterViewInit, ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchQueries } from '@core/ldap/search';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { SearchResult } from '@features/search/models/search-result';
import { SearchType } from '@features/search/models/search-type';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import {
  ButtonComponent,
  DropdownComponent,
  MdFormComponent,
  SpinnerComponent,
} from 'multidirectory-ui-kit';
import { catchError, map, switchMap, throwError } from 'rxjs';
import { SearchSource } from './models/search-source';
import { SearchResultComponent } from './search-forms/search-result/search-result.component';
import { SearchUsersComponent } from './search-forms/search-users/search-users.component';
import { SearchSourceProvider } from './services/search-source-provider';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  imports: [
    MdFormComponent,
    DropdownComponent,
    ButtonComponent,
    FormsModule,
    TranslocoPipe,
    SearchUsersComponent,
    SearchResultComponent,
    SpinnerComponent,
  ],
  providers: [SearchSourceProvider],
})
export class SearchPanelComponent implements AfterViewInit {
  private api = inject(MultidirectoryApiService);
  private searchSourceProvider = inject(SearchSourceProvider);
  private ldapLoader = inject(LdapEntryLoader);
  private cdr = inject(ChangeDetectorRef);

  SearchType = SearchType;
  searchType = SearchType.Ldap;
  searchTypes = [{ title: translate('search-panel.user-search-type'), value: SearchType.Ldap }];

  selectedSearchSource?: string;
  searchSources: string[] = [];
  searchResults: SearchResult[] = [];

  readonly searchUserForm = viewChild.required<SearchUsersComponent>('searchUserForm');
  readonly searchResultForm = viewChild.required<SearchResultComponent>('searchResultForm');
  readonly spinner = viewChild.required<SpinnerComponent>('spinner');

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
    const query = this.searchUserForm().searchQuery.trim();
    if (!query || query.length < 2) {
      return;
    }
    const source = this.searchSources.find((x) => x == this.selectedSearchSource);
    if (!source) {
      return;
    }
    this.spinner().show();
    this.ldapLoader
      .get()
      .pipe(
        switchMap((x) => this.api.search(SearchQueries.findByName(query, x[0].id))),
        catchError((err) => {
          this.spinner().hide();
          return throwError(() => err);
        }),
      )
      .subscribe((res) => {
        this.searchResults = res.search_result.map(
          (node) =>
            ({
              name: node.object_name,
            }) as SearchResult,
        );
        this.cdr.detectChanges();
        this.spinner().hide();
      });
  }

  clear() {
    this.searchResults = [];
  }
}
