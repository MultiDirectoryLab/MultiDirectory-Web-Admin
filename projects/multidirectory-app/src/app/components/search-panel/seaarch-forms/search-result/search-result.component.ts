import { Component, Input } from "@angular/core";
import { SearchRow } from "../../search-panel.component";

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
    columns = [
        { name: 'Имя',  prop: 'name',  flexGrow: 1 },
    ];
    @Input() rows: SearchRow[] = []
}