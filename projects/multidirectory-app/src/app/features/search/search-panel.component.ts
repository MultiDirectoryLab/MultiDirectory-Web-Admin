import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { DropdownOption, SpinnerComponent } from "multidirectory-ui-kit";
import { catchError, map, mapTo, throwError } from "rxjs";
import { translate } from "@ngneat/transloco";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { SearchResult } from "projects/multidirectory-app/src/app/features/search/models/search-result";
import { SearchType } from "projects/multidirectory-app/src/app/features/search/models/search-type";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { SearchResultComponent } from "./search-forms/search-result/search-result.component";
import { SearchUsersComponent } from "./search-forms/search-users/search-users.component";
import { SearchSource } from "./models/search-source";
import { SearchSourceProvider } from "./services/search-source-provider";
 
@Component({
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html', 
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements AfterViewInit {

    SearchType = SearchType;
    searchType = SearchType.Ldap; 
    searchTypes = [ 
        { title: translate('search-panel.user-search-type'), value: SearchType.Ldap },
    ];
    
    selectedSearchSource?: string;
    searchSources: string[] = [];
    searchResults: SearchResult[] = [];

    @ViewChild('searchUserForm') searchUserForm!: SearchUsersComponent;
    @ViewChild('searchResultForm') searchResultForm!: SearchResultComponent;
    @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;
    
    constructor(
        private api: MultidirectoryApiService, 
        private searchSourceProvider: SearchSourceProvider,
        private cdr: ChangeDetectorRef) {}
    
    ngAfterViewInit(): void {
        const mapToDropdown = (x: SearchSource[]) =>  x.map(y => y.title);
        this.searchSourceProvider.getSearchSources(SearchType.Ldap)
            .pipe(map(mapToDropdown))
            .subscribe(x => {
                this.searchSources = x;
                this.selectedSearchSource = x[0];
                this.cdr.detectChanges();
            })
    }
    
    search() {
        const query = this.searchUserForm.searchQuery.trim();
        if(!query || query.length < 2) {
            return;
        }
        const source = this.searchSources.find(x => x == this.selectedSearchSource);
        if(!source) {
            return;
        }
        this.spinner.show();
        this.api.search(SearchQueries.findByName(query, '')).pipe(
            catchError(err => {
                this.spinner.hide();
                return throwError(() => err);
            })
        ).subscribe(res => {
            this.searchResults = res.search_result.map(node => <SearchResult>{
                name: node.object_name,
            });
            this.cdr.detectChanges();
            this.spinner.hide();
        })
    }

    clear() {
        this.searchResults = [];
    }
}
