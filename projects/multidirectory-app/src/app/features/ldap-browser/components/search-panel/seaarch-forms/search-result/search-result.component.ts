import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { SearchResult } from "../../search-panel.component";
import { translate } from "@ngneat/transloco";
import { AppNavigationService } from "projects/multidirectory-app/src/app/services/app-navigation.service";

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
    columns = [
        { name: translate('search-result.name'),  prop: 'name',  flexGrow: 1 },
    ];
    @Input() rows?: SearchResult[] = undefined;

    constructor(private cdr: ChangeDetectorRef, private navigation: AppNavigationService) {}

    goTo(event: any) {
        if(event?.row?.name) {
            this.navigation.goTo([], event.row.name).then(x => {
                this.cdr.detectChanges();
            });
        }
        this.cdr.detectChanges();
    }
}