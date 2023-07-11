import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { SearchUsersComponent } from "./seaarch-forms/search-users/search-users.component";
import { LdapNode } from "../../core/ldap/ldap-tree-builder";
import { SearchResultComponent } from "./seaarch-forms/search-result/search-result.component";
import { MultidirectoryApiService } from "../../services/multidirectory-api.service";
import { SearchQueries } from "../../core/ldap/search";
import { SpinnerComponent, SpinnerHostDirective } from "multidirectory-ui-kit";


export interface SearchRow {
    name: string,
    entry?: LdapNode;
}

export enum SearchType {
    Users = 0,
    Other = 1
}
@Component({
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html', 
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent {
    SearchType = SearchType;
    searchType = SearchType.Users; 
    searchTypes = [ 
        { title: 'Пользователи, контакты и группы', value: SearchType.Users },
        { title: 'Другое', value: SearchType.Other }
    ];
    searchResults: SearchRow[] = [];
    @ViewChild('searchUserForm') searchUserForm!: SearchUsersComponent;
    @ViewChild('searchResultForm') searchResultForm!: SearchResultComponent;
    @ViewChild('spinner', { static: true }) spinner!: SpinnerComponent;
    constructor(private api: MultidirectoryApiService, private cdr: ChangeDetectorRef) {}
    search() {
        const query = this.searchUserForm.searchQuery;
        this.spinner.show();
        this.api.search(SearchQueries.findByName(query)).subscribe(res => {
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