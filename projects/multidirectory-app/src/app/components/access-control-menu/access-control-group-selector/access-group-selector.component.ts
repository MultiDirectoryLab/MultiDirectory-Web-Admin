import { Component, ViewChild, ViewChildren } from "@angular/core";
import { MdModalComponent } from "multidirectory-ui-kit";
import { MultidirectoryApiService } from "../../../services/multidirectory-api.service";
import { SearchQueries } from "../../../core/ldap/search";
import { Observable, Subject, switchMap } from "rxjs";
import { GroupSelection } from "../../../core/access-control/access-control";

@Component({
    selector: 'app-access-group-selector',
    templateUrl: './access-group-selector.component.html',
    styleUrls: ['./access-group-selector.component.scss']
}) 
export class AccessGroupSelectorComponent {
    @ViewChild('groupSelectorModal') groupSelectorModal!: MdModalComponent;
    groups: GroupSelection[] = [];
    closeRx = new Subject<GroupSelection[]>
    constructor(private api: MultidirectoryApiService) {}
    open(): Observable<GroupSelection[]> {
        return this.api.search(SearchQueries.findAccessGroups('')).pipe(switchMap(result => {
            this.groups = result.search_result.map(x => {
                return new GroupSelection({
                    dn: x.object_name,
                    name: x.partial_attributes.find(attr => attr.type == 'name')?.vals[0]
                })
            });
            this.groupSelectorModal.open();
            return this.closeRx.asObservable();
        }));
    }

    close() {
        this.closeRx.next(this.groups.filter(x => x.selected))
        this.groupSelectorModal.close();
    }
}