import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchResult } from '@features/search/models/search-result';
import { SearchType } from '@features/search/models/search-type';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  DropdownComponent,
  DropdownOption,
  MdFormComponent,
  SpinnerComponent,
} from 'multidirectory-ui-kit';
import { catchError, map, throwError } from 'rxjs';
import { SearchSource } from './models/search-source';
import { SearchResultComponent } from './search-forms/search-result/search-result.component';
import { SearchUsersComponent } from './search-forms/search-users/search-users.component';
import { SearchSourceProvider } from './services/search-source-provider';
import { MultidirectoryApiService } from '@services/multidirectory-api.service';
import { SearchQueries } from '@core/ldap/search';

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
  private searchSourceProvider = inject(SearchSourceProvider);
  private api = inject(MultidirectoryApiService);
  private cdr = inject(ChangeDetectorRef);
  SearchType = SearchType;
  searchType = SearchType.Ldap;
  searchTypes = [{ title: translate('search-panel.user-search-type'), value: SearchType.Ldap }];

  selectedSearchSource?: string;
  searchSources: DropdownOption[] = [];
  searchResults: SearchResult[] = [];

  @ViewChild('searchUserForm') searchUserForm!: SearchUsersComponent;
  @ViewChild('searchResultForm') searchResultForm!: SearchResultComponent;
  @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;

  ngAfterViewInit(): void {
    const mapToDropdown = (x: SearchSource[]) =>
      x.map(
        (y) =>
          new DropdownOption({
            title: y.title,
            value: y.data.id,
          }),
      );
    this.searchSourceProvider
      .getSearchSources(SearchType.Ldap)
      .pipe(map(mapToDropdown))
      .subscribe((x) => {
        this.searchSources = x;
        this.selectedSearchSource = x[0].value;
        this.cdr.detectChanges();
      });
  }

  search() {
    const query = this.searchUserForm.searchQuery.trim();
    if (!query || query.length < 2) {
      return;
    }
    this.spinner.show();
    this.api
      .search(SearchQueries.findByName(query, this.selectedSearchSource ?? ''))
      .pipe(
        catchError((err) => {
          this.spinner.hide();
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
        this.spinner.hide();
      });
  }

  clear() {
    this.searchResults = [];
  }
  onSubmit($event: SubmitEvent) {
    $event.stopPropagation();
    $event.preventDefault();
    this.search();
  }
}
