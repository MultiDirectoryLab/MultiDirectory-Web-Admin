import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { SearchRow } from "../../search-panel.component";
import { LdapLoader } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent {
    columns = [
        { name: 'Имя',  prop: 'name',  flexGrow: 1 },
    ];
    @Input() rows: SearchRow[] = [];

    constructor(private cdr: ChangeDetectorRef, private navigation: LdapNavigationService) {}

    goTo(event: any) {
        if(event?.row?.name) {
            console.log(event.row.name);
            this.navigation.goTo(event.row.name).then(x => {
                this.cdr.detectChanges();
            });
        }
        this.cdr.detectChanges();
    }



}