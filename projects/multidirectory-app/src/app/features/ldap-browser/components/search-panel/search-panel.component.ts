import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { SpinnerComponent } from "multidirectory-ui-kit";
import { catchError, throwError } from "rxjs";
import { SearchResultComponent } from "./seaarch-forms/search-result/search-result.component";
import { SearchUsersComponent } from "./seaarch-forms/search-users/search-users.component";
import { translate } from "@ngneat/transloco";
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { SearchQueries } from "projects/multidirectory-app/src/app/core/ldap/search";
import { SearchMode } from "projects/multidirectory-app/src/app/core/search/search-mode";
import { SearchResult } from "projects/multidirectory-app/src/app/core/search/search-result";
import { SearchSource } from "projects/multidirectory-app/src/app/core/search/search-source";
import { SearchType } from "projects/multidirectory-app/src/app/core/search/search-type";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
 
@Component({
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html', 
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements AfterViewInit {
    _ldapRoots: LdapEntryNode[] | null = null;

    get ldapRoots(): LdapEntryNode[] | null { return this._ldapRoots; }
    @Input() set ldapRoots(ldapRoots: LdapEntryNode[] | null) {
        this._ldapRoots = ldapRoots;
        this._ldapRoots?.forEach(v => this.searchSources.push({
            title: v.name!, 
            value: SearchSource.RootDse,
            data: v
         }));
        this.searchSource = this.searchSources?.[0]?.value;
    }

    SearchType = SearchType;
    searchType = SearchType.Users; 
    searchTypes = [ 
        { title: translate('search-panel.user-search-type'), value: SearchType.Users },
    ];

    searchSources: SearchMode[] = [  
    ];
    searchSource?: SearchSource;

    searchResults?: SearchResult[];
    @ViewChild('searchUserForm') searchUserForm!: SearchUsersComponent;
    @ViewChild('searchResultForm') searchResultForm!: SearchResultComponent;
    @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;
    
    constructor(
        private api: MultidirectoryApiService, 
        private cdr: ChangeDetectorRef) {}
    
    ngAfterViewInit(): void {
    }
    
    search() {
        const query = this.searchUserForm.searchQuery.trim();
        if(!query || query.length < 2) {
            return;
        }
        const source = this.searchSources.find(x => x.value == this.searchSource);
        this.spinner.show();
        this.api.search(SearchQueries.findByName(query, source?.data)).pipe(
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
        this.searchResults = undefined;
    }
}

export { SearchResult };
