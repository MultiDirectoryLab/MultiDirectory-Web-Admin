import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { SpinnerComponent } from "multidirectory-ui-kit";
import { catchError, throwError } from "rxjs";
import { LdapEntity } from "../../core/ldap/ldap-loader";
import { SearchQueries } from "../../core/ldap/search";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchResultComponent } from "./seaarch-forms/search-result/search-result.component";
import { SearchUsersComponent } from "./seaarch-forms/search-users/search-users.component";
import { SearchSource } from "../../core/search/search-source";
import { SearchType } from "../../core/search/search-type";
import { SearchMode } from "../../core/search/search-mode";
import { SearchResult } from "../../core/search/search-result";

@Component({
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html', 
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements AfterViewInit {
    _ldapRoots: LdapEntity[] | null = null;

    get ldapRoots(): LdapEntity[] | null { return this._ldapRoots; }
    @Input() set ldapRoots(ldapRoots: LdapEntity[] | null) {
        this._ldapRoots = ldapRoots;
        this._ldapRoots?.forEach(v => this.searchSources.push({
            title: v.name!, 
            value: SearchSource.RootDse,
            data: v
         }));
    }

    SearchType = SearchType;
    searchType = SearchType.Users; 
    searchTypes = [ 
        { title: 'Пользователи, контакты и группы', value: SearchType.Users },
    ];

    searchSources: SearchMode[] = [  
    ];
    searchSource = SearchSource.RootDse;

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
        const query = this.searchUserForm.searchQuery;
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
