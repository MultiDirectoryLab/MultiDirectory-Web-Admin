import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { DropdownMenuComponent } from "multidirectory-ui-kit";
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { LdapEntryType } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-type";
import { DeleteEntryRequest } from "projects/multidirectory-app/src/app/models/entry/delete-request";
import { AppNavigationService } from "projects/multidirectory-app/src/app/services/app-navigation.service";
import { AppWindowsService } from "projects/multidirectory-app/src/app/services/app-windows.service";
import { ContextMenuService } from "projects/multidirectory-app/src/app/services/contextmenu.service";
import { MultidirectoryApiService } from "projects/multidirectory-app/src/app/services/multidirectory-api.service";
import { Subject, concat, take, takeUntil } from "rxjs";

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
    @ViewChild('contextMenu', { static: true }) contextMenuRef!: DropdownMenuComponent;
    private unsubscribe = new Subject<void>();
    LdapEntryType = LdapEntryType;
    entries: LdapEntryNode[] = [];
    constructor(
        private contextMenuService: ContextMenuService,
        private windows: AppWindowsService,
        private api: MultidirectoryApiService,
        private navigation: AppNavigationService
    ) {

    }
    ngAfterViewInit(): void {
        this.contextMenuService.contextMenuOnNodeRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.entries = x.entries;
            this.contextMenuRef.setPosition(x.openX, x.openY);
            this.contextMenuRef.open();
        });
    }
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    isSelectedRowsOfType(type: LdapEntryType): boolean {
        return this.entries.every(x => x.type == type);
    }
 
    showEntryProperties() {
        if(this.entries.length <= 0) {
            return;
        }
        this.windows.openEntityProperiesModal(this.entries[0]).pipe(
            take(1)
        ).subscribe(x => {
            this.windows.closeEntityPropertiesModal(x);
        })
    }

    showChangePassword() {
        if(this.entries.length < 1) {
            return;
        }
        this.windows.openChangePasswordModal(this.entries[0]);
    }

    showDeleteConfirmation(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.windows.openDeleteEntryConfirmation(this.entries.map(x => x.id)).pipe(
            take(1)
        ).subscribe(confirmed => {
            if(confirmed) {
                concat(...this.entries.map(x => 
                    this.api.delete(new DeleteEntryRequest({
                        entry: (<any>x.entry).object_name
                    }))
                )).subscribe(x => {
                    this.navigation.reload();
                });
            }
        })
    }
}