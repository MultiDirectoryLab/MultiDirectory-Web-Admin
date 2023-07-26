import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { SearchUsersComponent } from "./seaarch-forms/search-users/search-users.component";
import { LdapNode } from "../../core/ldap/ldap-loader";
import { SearchResultComponent } from "./seaarch-forms/search-result/search-result.component";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchQueries } from "../../core/ldap/search";
import { SpinnerComponent, SpinnerHostDirective } from "multidirectory-ui-kit";
import { LdapNavigationService } from "../../services/ldap-navigation.service";


export interface SearchRow {
    name: string,
    entry?: LdapNode;
}

export enum SearchType {
    Users = 0,
    Other = 1
}

export enum SearchSource {
    RootDse = 0,
    Other = 10 
}
@Component({
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html', 
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements AfterViewInit {
    _ldapRoots?: LdapNode[];

    get ldapRoots(): LdapNode[] | undefined { return this._ldapRoots; }
    @Input() set ldapRoots(ldapRoots: LdapNode[] | undefined) {
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
        { title: 'Другое', value: SearchType.Other }
    ];

    searchSources = [ 
        { title: 'Другое', value: SearchSource.Other, data:  <any>'' }
    ];
    searchSource = SearchSource.RootDse;

    searchResults: SearchRow[] = [];
    @ViewChild('searchUserForm') searchUserForm!: SearchUsersComponent;
    @ViewChild('searchResultForm') searchResultForm!: SearchResultComponent;
    @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;
    
    constructor(
        private api: MultidirectoryApiService, 
        private navigation: LdapNavigationService, 
        private cdr: ChangeDetectorRef) {}
    
    ngAfterViewInit(): void {
    }
    
    search() {
        const query = this.searchUserForm.searchQuery;
        const source = this.searchSources.find(x => x.value == this.searchSource);
        this.spinner.show();
        this.api.search(SearchQueries.findByName(query, source?.data)).subscribe(res => {
            this.searchResults = res.search_result.map(node => <SearchRow>{
                name: node.object_name,
            });
            this.searchResultForm.rows = this.searchResults;
            this.cdr.detectChanges();
            this.spinner.hide();
        })
    }

    clear() {
        this.searchResultForm.rows = [];
    }
}