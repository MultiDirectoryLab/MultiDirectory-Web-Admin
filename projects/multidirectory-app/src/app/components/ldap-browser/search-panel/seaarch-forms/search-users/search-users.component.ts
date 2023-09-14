import { Component, EventEmitter, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'app-search-users',
    styleUrls: ['./search-users.component.scss'],
    templateUrl: './search-users.component.html'
})
export class SearchUsersComponent {
    searchQuery: string = '';
    @Output() onClear = new EventEmitter<void>();
    
    clear() {
        this.searchQuery = '';
        this.onClear.emit();
    }
}